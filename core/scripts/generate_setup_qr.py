"""
Generates the Wi-Fi setup QR code printed on the Lery box.

Scanning it joins the device's setup hotspot with one tap; the captive portal
then opens by itself. Credentials are derived from the device's machine-id, so
run this ON the Pi (factory step) or pass the Pi's id with --machine-id.

    pip install "qrcode[pil]"
    python scripts/generate_setup_qr.py                      # on the Pi
    python scripts/generate_setup_qr.py --machine-id <id> -o lery-qr.png
"""
import argparse
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from wifi_manager import ap_credentials, wifi_qr_payload  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument('--machine-id', help="Target device's /etc/machine-id (default: this machine's)")
    parser.add_argument('-o', '--output', default='lery-setup-qr.png')
    args = parser.parse_args()

    ssid, password = ap_credentials(args.machine_id)
    payload = wifi_qr_payload(ssid, password)

    try:
        import qrcode
    except ImportError:
        sys.exit('Missing dependency: pip install "qrcode[pil]"')

    qrcode.make(payload).save(args.output)
    print(f'SSID:     {ssid}')
    print(f'Password: {password}')
    print(f'QR saved: {args.output}')


if __name__ == '__main__':
    main()
