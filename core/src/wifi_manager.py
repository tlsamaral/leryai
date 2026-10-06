from __future__ import annotations

import hashlib
import os
import shutil
import subprocess
import time
from typing import Callable, List, Optional, Tuple

HOTSPOT_CONNECTION = 'lery-setup-ap'
_WIFI_TYPE = '802-11-wireless'


class WifiError(Exception):
    """Raised when an nmcli operation fails."""


def ap_credentials(machine_id: Optional[str] = None) -> Tuple[str, str]:
    """
    SSID + WPA2 password of the setup hotspot.

    Unique per device (derived from /etc/machine-id) so the QR code printed
    on the box is the only way to join the hotspot. LERY_AP_SSID /
    LERY_AP_PASSWORD override both (dev / custom provisioning).
    """
    ssid = os.getenv('LERY_AP_SSID')
    password = os.getenv('LERY_AP_PASSWORD')
    if ssid and password:
        return ssid, password

    if machine_id is None:
        try:
            with open('/etc/machine-id') as f:
                machine_id = f.read().strip()
        except OSError:
            machine_id = 'lery-unknown-device'

    digest = hashlib.sha256(f'lery-setup:{machine_id}'.encode()).hexdigest()
    return ssid or f'Lery-Setup-{digest[:4].upper()}', password or digest[4:12]


def wifi_qr_payload(ssid: str, password: str) -> str:
    """Standard Wi-Fi QR payload — phones join the network with a single tap."""
    def esc(value: str) -> str:
        for ch in ('\\', ';', ',', ':', '"'):
            value = value.replace(ch, '\\' + ch)
        return value

    return f'WIFI:T:WPA;S:{esc(ssid)};P:{esc(password)};;'


def _split_terse(line: str) -> List[str]:
    """Splits an `nmcli -t` line on ':' honouring the '\\:' escape."""
    fields: List[str] = []
    cur: List[str] = []
    i = 0
    while i < len(line):
        ch = line[i]
        if ch == '\\' and i + 1 < len(line):
            cur.append(line[i + 1])
            i += 2
            continue
        if ch == ':':
            fields.append(''.join(cur))
            cur = []
        else:
            cur.append(ch)
        i += 1
    fields.append(''.join(cur))
    return fields


def _default_runner(args: List[str], timeout: float) -> subprocess.CompletedProcess:
    # Args are deliberately never logged — they may contain the Wi-Fi password.
    return subprocess.run(['nmcli', *args], capture_output=True, text=True, timeout=timeout)


class WifiManager:
    """Thin NetworkManager (nmcli) wrapper: scan, connect, hotspot, forget."""

    def __init__(
        self,
        interface: Optional[str] = None,
        runner: Callable[[List[str], float], subprocess.CompletedProcess] = _default_runner,
    ):
        self._interface = interface or os.getenv('LERY_WIFI_IFACE')
        self._run = runner

    @staticmethod
    def is_available() -> bool:
        return shutil.which('nmcli') is not None

    def _nmcli(self, *args: str, timeout: float = 30, check: bool = True) -> str:
        try:
            proc = self._run(list(args), timeout)
        except subprocess.TimeoutExpired as e:
            raise WifiError('nmcli timed out') from e
        if check and proc.returncode != 0:
            raise WifiError((proc.stderr or proc.stdout or 'nmcli failed').strip())
        return proc.stdout or ''

    def _wifi_interface(self) -> str:
        if self._interface:
            return self._interface
        for line in self._nmcli('-t', '-f', 'DEVICE,TYPE', 'device').splitlines():
            device, _, dev_type = line.partition(':')
            if dev_type == 'wifi':
                self._interface = device
                return device
        raise WifiError('No Wi-Fi interface found')

    # ── Status ────────────────────────────────────────────────────────────────

    def is_connected(self) -> bool:
        """True when a Wi-Fi or Ethernet link is up (the setup hotspot doesn't count)."""
        out = self._nmcli('-t', '-f', 'TYPE,STATE,CONNECTION', 'device', check=False)
        for line in out.splitlines():
            dev_type, state, connection = (_split_terse(line) + ['', '', ''])[:3]
            if state == 'connected' and dev_type in ('wifi', 'ethernet') and connection != HOTSPOT_CONNECTION:
                return True
        return False

    def wait_until_connected(self, timeout: float) -> bool:
        deadline = time.monotonic() + timeout
        while True:
            if self.is_connected():
                return True
            if time.monotonic() >= deadline:
                return False
            time.sleep(1)

    def _saved_wifi_profiles(self) -> List[str]:
        out = self._nmcli('-t', '-f', 'NAME,TYPE', 'connection', 'show', check=False)
        profiles = []
        for line in out.splitlines():
            name, conn_type = (_split_terse(line) + [''])[:2]
            if conn_type == _WIFI_TYPE and name != HOTSPOT_CONNECTION:
                profiles.append(name)
        return profiles

    def has_saved_networks(self) -> bool:
        return bool(self._saved_wifi_profiles())

    # ── Scan ──────────────────────────────────────────────────────────────────

    def scan(self) -> List[dict]:
        """Visible networks, strongest first. Must run BEFORE the hotspot is up."""
        try:
            out = self._nmcli(
                '-t', '-f', 'SSID,SIGNAL,SECURITY', 'device', 'wifi', 'list', '--rescan', 'yes',
                timeout=30,
            )
        except WifiError as e:
            print(f'[Wifi] scan failed: {e}')
            return []

        best: dict = {}
        for line in out.splitlines():
            ssid, signal, security = (_split_terse(line) + ['', '', ''])[:3]
            if not ssid or ssid == HOTSPOT_CONNECTION:
                continue
            try:
                strength = int(signal)
            except ValueError:
                strength = 0
            if ssid not in best or strength > best[ssid]['signal']:
                best[ssid] = {
                    'ssid': ssid,
                    'signal': strength,
                    'secure': security not in ('', '--'),
                }
        return sorted(best.values(), key=lambda n: n['signal'], reverse=True)

    # ── Connect / forget ──────────────────────────────────────────────────────

    def connect(self, ssid: str, password: str = '') -> None:
        args = ['-w', '30', 'device', 'wifi', 'connect', ssid]
        if password:
            args += ['password', password]
        try:
            self._nmcli(*args, timeout=45)
        except WifiError:
            # Don't leave a profile with a bad password behind — it would keep auto-retrying.
            self._nmcli('connection', 'delete', ssid, check=False)
            raise

    def forget_all(self) -> None:
        for name in self._saved_wifi_profiles():
            self._nmcli('connection', 'delete', name, check=False)
        self.stop_hotspot()

    # ── Hotspot ───────────────────────────────────────────────────────────────

    def start_hotspot(self, ssid: str, password: str) -> None:
        self.stop_hotspot()
        self._nmcli(
            'device', 'wifi', 'hotspot',
            'ifname', self._wifi_interface(),
            'con-name', HOTSPOT_CONNECTION,
            'ssid', ssid,
            'password', password,
        )
        # Never bring the hotspot back on its own after a reboot.
        self._nmcli('connection', 'modify', HOTSPOT_CONNECTION, 'connection.autoconnect', 'no', check=False)

    def stop_hotspot(self) -> None:
        self._nmcli('connection', 'down', HOTSPOT_CONNECTION, check=False)
        self._nmcli('connection', 'delete', HOTSPOT_CONNECTION, check=False)
