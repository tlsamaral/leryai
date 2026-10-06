from __future__ import annotations

import os
import queue
import time
from typing import Callable, List, Optional, Tuple

from provisioning_portal import ProvisioningPortal
from wifi_manager import WifiError, WifiManager, ap_credentials

# Events passed to the announce callback
AP_READY = 'ap_ready'        # hotspot + portal up, waiting for the user
WAITING = 'waiting'          # periodic reminder while still waiting
CONNECTING = 'connecting'    # credentials received, joining the network
CONNECTED = 'connected'      # online
FAILED = 'failed'            # join failed (usually wrong password) — hotspot comes back

Announce = Callable[[str], None]

# What Lery says for each event. English only (the learner's target language); played from
# pre-rendered files in assets/audio/provisioning/<event>.mp3 when present — there is no internet
# yet, so cloud TTS is impossible and the offline engine sounds robotic.
SPOKEN_PROMPTS = {
    AP_READY: "Hi! I need your Wi-Fi. Scan the QR code on my box with your phone.",
    WAITING: "I'm still waiting. Scan the QR code on my box to connect me to Wi-Fi.",
    FAILED: "I could not connect. Please check the password and try again.",
    CONNECTED: "I'm connected! Say, hey Lery, to start.",
}


class ProvisioningFlow:
    """
    Wi-Fi onboarding: Lery becomes an access point, the user joins it (QR on the
    box), picks a network on the captive portal, Lery joins it and drops the AP.
    Blocks until Lery is online.
    """

    def __init__(
        self,
        wifi: WifiManager,
        announce: Optional[Announce] = None,
        credentials: Optional[Tuple[str, str]] = None,
        portal_factory: Callable[..., ProvisioningPortal] = ProvisioningPortal,
        portal_port: Optional[int] = None,
        remind_every: float = 90,
        retry_saved_every: float = 180,
        idle_grace: float = 120,
        handoff_delay: float = 2.0,
        poll: float = 1.0,
    ):
        self._wifi = wifi
        self._announce_cb = announce or (lambda _event: None)
        self._credentials = credentials or ap_credentials()
        self._portal_factory = portal_factory
        self._portal_port = portal_port if portal_port is not None else int(os.getenv('LERY_PORTAL_PORT', '80'))
        self._remind_every = remind_every
        self._retry_saved_every = retry_saved_every
        self._idle_grace = idle_grace
        self._handoff_delay = handoff_delay
        self._poll = poll

    def _announce(self, event: str) -> None:
        try:
            self._announce_cb(event)
        except Exception as e:  # feedback must never break provisioning
            print(f'[Provisioning] announce({event}) failed: {e}')

    def run(self) -> None:
        ssid, password = self._credentials
        networks = self._wifi.scan()  # the radio can't scan reliably once the AP is up

        while True:
            creds = self._serve_hotspot(ssid, password, networks)
            if creds is None:  # a saved network came back on its own
                self._announce(CONNECTED)
                return

            self._announce(CONNECTING)
            time.sleep(self._handoff_delay)  # let the phone receive the HTTP response
            self._wifi.stop_hotspot()
            try:
                self._wifi.connect(*creds)
            except WifiError as e:
                print(f'[Provisioning] connect failed: {e}')
                self._announce(FAILED)
                networks = self._wifi.scan()
                continue

            self._announce(CONNECTED)
            return

    def _serve_hotspot(
        self, ssid: str, password: str, networks: List[dict]
    ) -> Optional[Tuple[str, str]]:
        """Runs hotspot + portal. Returns submitted (ssid, password), or None if Lery got online by itself."""
        inbox: 'queue.Queue[Tuple[str, str]]' = queue.Queue()
        self._wifi.start_hotspot(ssid, password)
        portal = self._portal_factory(
            networks=lambda: networks,
            on_credentials=lambda s, p: inbox.put((s, p)),
            port=self._portal_port,
        )
        portal.start()
        try:
            self._announce(AP_READY)
            last_reminder = last_retry = time.monotonic()

            while True:
                try:
                    return inbox.get(timeout=self._poll)
                except queue.Empty:
                    pass

                now = time.monotonic()
                if now - last_reminder >= self._remind_every:
                    last_reminder = now
                    self._announce(WAITING)

                # Power-outage case: router came back after Lery booted — try saved networks
                # again, but never while someone is using the portal.
                if (
                    now - last_retry >= self._retry_saved_every
                    and now - portal.last_activity >= self._idle_grace
                    and self._wifi.has_saved_networks()
                ):
                    last_retry = now
                    self._wifi.stop_hotspot()
                    if self._wifi.wait_until_connected(20):
                        return None
                    self._wifi.start_hotspot(ssid, password)
        finally:
            portal.stop()


def ensure_network(
    wifi: Optional[WifiManager] = None,
    announce: Optional[Announce] = None,
    boot_grace: Optional[float] = None,
) -> bool:
    """
    Makes sure Lery is online, running the provisioning flow if it isn't.
    Returns True when provisioning ran. Skips silently where NetworkManager is
    unavailable (desktop dev) or LERY_SKIP_WIFI_SETUP=1.
    """
    if os.getenv('LERY_SKIP_WIFI_SETUP') == '1':
        return False

    wifi = wifi or WifiManager()
    if not wifi.is_available():
        print('[Wifi] nmcli not found — skipping Wi-Fi provisioning')
        return False

    if boot_grace is None:
        boot_grace = float(os.getenv('LERY_WIFI_BOOT_GRACE', '45'))

    wifi.stop_hotspot()  # leftover from a crash while in setup mode
    if wifi.is_connected():
        return False
    if wifi.has_saved_networks() and wifi.wait_until_connected(boot_grace):
        return False

    ProvisioningFlow(wifi, announce=announce).run()
    return True
