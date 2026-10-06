#!/usr/bin/env bash
# One-time setup for Wi-Fi provisioning on the Pi (Armbian / Ubuntu / Debian).
# Run as root:  sudo bash scripts/setup_wifi_provisioning.sh
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Run as root (sudo)." >&2
  exit 1
fi

# 1. NetworkManager (+ dnsmasq-base, used by its hotspot / "shared" mode)
if ! command -v nmcli >/dev/null; then
  echo "Installing NetworkManager..."
  apt-get update
  apt-get install -y network-manager
fi
apt-get install -y dnsmasq-base

# 2. Captive-portal DNS: while the hotspot is up, every hostname resolves to Lery
#    (10.42.0.1), so phones detect the portal and open the setup page automatically.
#    This directory is only read by NetworkManager's hotspot dnsmasq — normal DNS is untouched.
mkdir -p /etc/NetworkManager/dnsmasq-shared.d
echo 'address=/#/10.42.0.1' > /etc/NetworkManager/dnsmasq-shared.d/lery-captive.conf

# 3. NetworkManager must own the Wi-Fi interface.
if command -v netplan >/dev/null; then
  echo "netplan detected: make sure /etc/netplan/*.yaml has 'renderer: NetworkManager', then 'netplan apply'."
fi
systemctl enable --now NetworkManager

echo
echo "Done. Check the radio supports AP mode (Pi 3 onboard Wi-Fi does):"
echo "  iw list | grep -A8 'Supported interface modes' | grep AP"
echo "Test the hotspot by hand:"
echo "  nmcli device wifi hotspot ssid Lery-Test password 12345678"
echo "  nmcli connection down Hotspot"
echo
echo "The portal listens on port 80 — run Lery as root, or set LERY_PORTAL_PORT."
