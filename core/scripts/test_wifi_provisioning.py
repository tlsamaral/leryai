"""
Manual test harness for Wi-Fi provisioning.

  Preview (any machine, no nmcli, no hardware) — check the portal UI and the wrong-password loop:
      python scripts/test_wifi_provisioning.py --preview
      -> open the printed URL on your phone (same Wi-Fi as this computer).
         The fake network accepts the password "correct123"; anything else fails and the flow loops.

  Real (on the Pi, as root, Wi-Fi hardware + NetworkManager):
      sudo python3 scripts/test_wifi_provisioning.py [--forget]
      Runs the real flow: hotspot -> captive portal -> join -> drop hotspot. No audio, no LEDs.

  !! The Pi's Wi-Fi radio becomes the hotspot, so an SSH session OVER Wi-Fi will drop.
     Run it over Ethernet (or with a monitor + keyboard), and unplug nothing you need.
  !! --forget deletes ALL saved Wi-Fi networks on the Pi first (simulates a first boot).
"""
import argparse
import os
import socket
import sys
import time

CORE = os.path.join(os.path.dirname(__file__), '..')
sys.path.insert(0, os.path.join(CORE, 'src'))

from provisioning import ProvisioningFlow  # noqa: E402
from wifi_manager import WifiError, WifiManager, ap_credentials, wifi_qr_payload  # noqa: E402


def log(message: str) -> None:
    print(f'[{time.strftime("%H:%M:%S")}] {message}', flush=True)


def lan_ip() -> str:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))  # no packet is sent
        return s.getsockname()[0]
    except OSError:
        return '127.0.0.1'
    finally:
        s.close()


class PreviewWifi:
    """Stands in for WifiManager so the portal + flow logic run anywhere."""

    PASSWORD = 'correct123'

    def scan(self):
        return [
            {'ssid': 'Casa do Talles', 'signal': 88, 'secure': True},
            {'ssid': 'Vizinho_2G', 'signal': 61, 'secure': True},
            {'ssid': 'Cafe Aberto', 'signal': 42, 'secure': False},
            {'ssid': 'Rede com acento é ç', 'signal': 35, 'secure': True},
        ]

    def start_hotspot(self, ssid, password):
        log(f'(fake) hotspot up: {ssid}')

    def stop_hotspot(self):
        log('(fake) hotspot down')

    def connect(self, ssid, password=''):
        log(f'(fake) joining "{ssid}" (password: {len(password)} chars)')
        time.sleep(1)
        if password != self.PASSWORD:
            raise WifiError('Secrets were required, but not provided')

    def has_saved_networks(self):
        return False

    def is_connected(self):
        return False

    def wait_until_connected(self, timeout):
        return False


def print_qr(payload: str) -> None:
    try:
        import qrcode
    except ImportError:
        log('(pip install "qrcode[pil]" to see the QR here)')
        return
    qr = qrcode.QRCode(border=1)
    qr.add_data(payload)
    qr.print_ascii(invert=True)


def run_preview(port: int) -> None:
    ip = lan_ip()
    log(f'Open on your phone:  http://{ip}:{port}')
    log(f'Correct password for any network: {PreviewWifi.PASSWORD}')
    flow = ProvisioningFlow(
        PreviewWifi(),
        announce=lambda event: log(f'event: {event}'),
        credentials=('Lery-Setup-PREVIEW', 'preview12'),
        portal_port=port,
        remind_every=20,
    )
    flow.run()
    log('Flow finished: connected.')


def run_real(forget: bool) -> None:
    if os.geteuid() != 0:
        sys.exit('Run as root (sudo): the portal listens on port 80 and nmcli needs privileges.')

    wifi = WifiManager()
    if not wifi.is_available():
        sys.exit('nmcli not found — run scripts/setup_wifi_provisioning.sh first.')

    if forget:
        log('Forgetting all saved Wi-Fi networks...')
        wifi.forget_all()

    ssid, password = ap_credentials()
    payload = wifi_qr_payload(ssid, password)
    log(f'Hotspot SSID: {ssid}   password: {password}')
    log(f'QR payload:   {payload}')
    print_qr(payload)

    flow = ProvisioningFlow(wifi, announce=lambda event: log(f'event: {event}'))
    flow.run()

    log(f'Flow finished. is_connected={wifi.is_connected()}')
    os.system('nmcli -t -f ACTIVE,SSID,SIGNAL dev wifi | grep "^yes" || true')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--preview', action='store_true', help='fake Wi-Fi backend, portal on --port')
    parser.add_argument('--port', type=int, default=8080, help='portal port in --preview mode')
    parser.add_argument('--forget', action='store_true', help='(real mode) delete saved networks first')
    args = parser.parse_args()

    try:
        run_preview(args.port) if args.preview else run_real(args.forget)
    except KeyboardInterrupt:
        log('Interrupted.')
        if not args.preview:
            WifiManager().stop_hotspot()  # don't leave the AP up


if __name__ == '__main__':
    main()
