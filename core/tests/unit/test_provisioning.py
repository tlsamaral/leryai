import json
import os
import subprocess
import sys
from urllib import error, request

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

from provisioning import AP_READY, CONNECTED, CONNECTING, FAILED, ProvisioningFlow, ensure_network
from provisioning_portal import ProvisioningPortal, validate_credentials
from wifi_manager import HOTSPOT_CONNECTION, WifiError, WifiManager, _split_terse, ap_credentials, wifi_qr_payload


def _proc(stdout='', returncode=0, stderr=''):
    return subprocess.CompletedProcess([], returncode, stdout, stderr)


class FakeRunner:
    """Maps a prefix of nmcli args to a CompletedProcess; records every call."""

    def __init__(self, responses=None):
        self.responses = responses or {}
        self.calls = []

    def __call__(self, args, timeout):
        self.calls.append(args)
        for prefix, result in self.responses.items():
            if ' '.join(args).startswith(prefix):
                return result
        return _proc()


# ── wifi_manager ──────────────────────────────────────────────────────────────

@pytest.mark.unit
class TestTerseParsing:
    def test_splits_on_colon(self):
        assert _split_terse('a:b:c') == ['a', 'b', 'c']

    def test_honours_escaped_colon(self):
        assert _split_terse(r'My\:Net:80:WPA2') == ['My:Net', '80', 'WPA2']

    def test_empty_fields(self):
        assert _split_terse('::x') == ['', '', 'x']


@pytest.mark.unit
class TestApCredentials:
    def test_deterministic_per_machine(self):
        assert ap_credentials('abc') == ap_credentials('abc')
        assert ap_credentials('abc') != ap_credentials('xyz')

    def test_wpa2_password_length_and_ssid_prefix(self):
        ssid, password = ap_credentials('abc')
        assert ssid.startswith('Lery-Setup-')
        assert len(password) == 8

    def test_env_override(self, monkeypatch):
        monkeypatch.setenv('LERY_AP_SSID', 'MyLery')
        monkeypatch.setenv('LERY_AP_PASSWORD', 'supersecret')
        assert ap_credentials('abc') == ('MyLery', 'supersecret')


@pytest.mark.unit
class TestQrPayload:
    def test_plain(self):
        assert wifi_qr_payload('Lery-Setup-AB12', 'abcd1234') == 'WIFI:T:WPA;S:Lery-Setup-AB12;P:abcd1234;;'

    def test_escapes_special_chars(self):
        assert wifi_qr_payload('a;b', 'p:w,"x"') == r'WIFI:T:WPA;S:a\;b;P:p\:w\,\"x\";;'


@pytest.mark.unit
class TestWifiManager:
    def test_scan_dedupes_sorts_and_flags_security(self):
        out = 'Home:70:WPA2\nHome:40:WPA2\nCafe:90:\n:55:WPA2\nOffice:30:--\n'
        runner = FakeRunner({'-t -f SSID,SIGNAL,SECURITY': _proc(out)})
        nets = WifiManager(interface='wlan0', runner=runner).scan()
        assert [n['ssid'] for n in nets] == ['Cafe', 'Home', 'Office']
        assert nets[1] == {'ssid': 'Home', 'signal': 70, 'secure': True}
        assert nets[0]['secure'] is False

    def test_scan_failure_returns_empty(self):
        runner = FakeRunner({'-t -f SSID': _proc(returncode=1, stderr='boom')})
        assert WifiManager(interface='wlan0', runner=runner).scan() == []

    def test_is_connected_true_for_wifi(self):
        runner = FakeRunner({'-t -f TYPE,STATE,CONNECTION': _proc('wifi:connected:Home\nethernet:unavailable:\n')})
        assert WifiManager(runner=runner).is_connected() is True

    def test_hotspot_does_not_count_as_connected(self):
        runner = FakeRunner({'-t -f TYPE,STATE,CONNECTION': _proc(f'wifi:connected:{HOTSPOT_CONNECTION}\n')})
        assert WifiManager(runner=runner).is_connected() is False

    def test_has_saved_networks_ignores_hotspot(self):
        out = f'{HOTSPOT_CONNECTION}:802-11-wireless\nlo:loopback\n'
        runner = FakeRunner({'-t -f NAME,TYPE': _proc(out)})
        assert WifiManager(runner=runner).has_saved_networks() is False

    def test_connect_failure_deletes_profile_and_raises(self):
        runner = FakeRunner({'-w 30 device wifi connect': _proc(returncode=4, stderr='Secrets were required')})
        with pytest.raises(WifiError, match='Secrets'):
            WifiManager(interface='wlan0', runner=runner).connect('Home', 'wrongpass')
        assert ['connection', 'delete', 'Home'] in runner.calls

    def test_start_hotspot_disables_autoconnect(self):
        runner = FakeRunner()
        WifiManager(interface='wlan0', runner=runner).start_hotspot('Lery-Setup-AB12', 'abcd1234')
        assert any(c[:3] == ['device', 'wifi', 'hotspot'] and 'wlan0' in c for c in runner.calls)
        assert ['connection', 'modify', HOTSPOT_CONNECTION, 'connection.autoconnect', 'no'] in runner.calls


# ── portal ────────────────────────────────────────────────────────────────────

@pytest.mark.unit
class TestValidateCredentials:
    @pytest.mark.parametrize('ssid,pw', [('Home', 'password1'), ('Open', ''), ('x' * 32, 'a' * 63)])
    def test_valid(self, ssid, pw):
        assert validate_credentials(ssid, pw) is None

    @pytest.mark.parametrize('ssid,pw', [('', 'password1'), ('x' * 33, 'password1'), ('Home', 'short'), (None, 'x'), ('Home', 5)])
    def test_invalid(self, ssid, pw):
        assert validate_credentials(ssid, pw) is not None


@pytest.fixture
def portal():
    received = []
    p = ProvisioningPortal(
        networks=lambda: [{'ssid': 'Home', 'signal': 80, 'secure': True}],
        on_credentials=lambda s, pw: received.append((s, pw)),
        host='127.0.0.1',
        port=0,
    )
    p.start()
    p.received = received
    yield p
    p.stop()


def _post(portal, body, content_type='application/json'):
    req = request.Request(
        f'http://127.0.0.1:{portal.port}/connect',
        data=body if isinstance(body, bytes) else json.dumps(body).encode(),
        headers={'Content-Type': content_type},
        method='POST',
    )
    return request.urlopen(req, timeout=5)


@pytest.mark.unit
class TestPortal:
    def test_networks_endpoint(self, portal):
        with request.urlopen(f'http://127.0.0.1:{portal.port}/networks', timeout=5) as r:
            assert json.loads(r.read())[0]['ssid'] == 'Home'

    @pytest.mark.parametrize('path', ['/', '/generate_204', '/hotspot-detect.html', '/connecttest.txt'])
    def test_captive_probes_get_setup_page(self, portal, path):
        with request.urlopen(f'http://127.0.0.1:{portal.port}{path}', timeout=5) as r:
            assert r.status == 200
            assert b'Lery' in r.read()

    def test_connect_json(self, portal):
        with _post(portal, {'ssid': 'Home', 'password': 'password1'}) as r:
            assert r.status == 202
        assert portal.received == [('Home', 'password1')]

    def test_connect_form_encoded(self, portal):
        with _post(portal, b'ssid=Home&password=password1', 'application/x-www-form-urlencoded') as r:
            assert r.status == 202
        assert portal.received == [('Home', 'password1')]

    def test_rejects_short_password(self, portal):
        with pytest.raises(error.HTTPError) as exc:
            _post(portal, {'ssid': 'Home', 'password': 'short'})
        assert exc.value.code == 400
        assert portal.received == []

    def test_rejects_oversized_body(self, portal):
        with pytest.raises(error.HTTPError) as exc:
            _post(portal, b'x' * 5000)
        assert exc.value.code == 400


# ── flow ──────────────────────────────────────────────────────────────────────

class FakeWifi:
    def __init__(self, connect_results=(None,), saved=False, connected=False):
        self.connect_results = list(connect_results)  # None = success, Exception = failure
        self.saved = saved
        self.connected = connected
        self.calls = []

    @staticmethod
    def is_available():
        return True

    def scan(self):
        self.calls.append('scan')
        return []

    def start_hotspot(self, ssid, password):
        self.calls.append('start_hotspot')

    def stop_hotspot(self):
        self.calls.append('stop_hotspot')

    def connect(self, ssid, password=''):
        self.calls.append(('connect', ssid))
        result = self.connect_results.pop(0)
        if result:
            raise result

    def is_connected(self):
        return self.connected

    def has_saved_networks(self):
        return self.saved

    def wait_until_connected(self, timeout):
        self.calls.append('wait')
        return self.connected


class FakePortal:
    """Submits the given credentials as soon as it starts."""

    submissions = []

    def __init__(self, networks, on_credentials, port):
        self._cb = on_credentials
        self.last_activity = 0.0

    def start(self):
        if FakePortal.submissions:
            self._cb(*FakePortal.submissions.pop(0))

    def stop(self):
        pass


def _flow(wifi, events, **kwargs):
    return ProvisioningFlow(
        wifi,
        announce=events.append,
        credentials=('Lery-Setup-TEST', 'abcd1234'),
        portal_factory=FakePortal,
        handoff_delay=0,
        poll=0.01,
        **kwargs,
    )


@pytest.mark.unit
class TestProvisioningFlow:
    def test_happy_path(self):
        FakePortal.submissions = [('Home', 'password1')]
        wifi, events = FakeWifi(), []
        _flow(wifi, events).run()
        assert events == [AP_READY, CONNECTING, CONNECTED]
        assert ('connect', 'Home') in wifi.calls
        # hotspot is dropped before joining the user's network
        assert wifi.calls.index('stop_hotspot') < wifi.calls.index(('connect', 'Home'))

    def test_wrong_password_brings_hotspot_back_then_succeeds(self):
        FakePortal.submissions = [('Home', 'wrongpass1'), ('Home', 'password1')]
        wifi, events = FakeWifi(connect_results=[WifiError('bad'), None]), []
        _flow(wifi, events).run()
        assert events == [AP_READY, CONNECTING, FAILED, AP_READY, CONNECTING, CONNECTED]
        assert wifi.calls.count('start_hotspot') == 2

    def test_saved_network_returning_ends_flow_without_credentials(self):
        FakePortal.submissions = []
        wifi, events = FakeWifi(saved=True, connected=True), []
        _flow(wifi, events, retry_saved_every=0, idle_grace=0).run()
        assert events == [AP_READY, CONNECTED]


@pytest.mark.unit
class TestEnsureNetwork:
    def test_skip_env(self, monkeypatch):
        monkeypatch.setenv('LERY_SKIP_WIFI_SETUP', '1')
        assert ensure_network(wifi=FakeWifi()) is False

    def test_already_connected_skips_provisioning(self, monkeypatch):
        monkeypatch.delenv('LERY_SKIP_WIFI_SETUP')
        assert ensure_network(wifi=FakeWifi(connected=True)) is False

    def test_saved_network_reconnects_within_grace(self, monkeypatch):
        monkeypatch.delenv('LERY_SKIP_WIFI_SETUP')
        wifi = FakeWifi(saved=True, connected=False)
        wifi.wait_until_connected = lambda timeout: True
        assert ensure_network(wifi=wifi, boot_grace=1) is False

    def test_no_network_runs_provisioning(self, monkeypatch):
        monkeypatch.delenv('LERY_SKIP_WIFI_SETUP')
        monkeypatch.setattr('provisioning.ProvisioningFlow', lambda wifi, announce: type('F', (), {'run': lambda s: None})())
        assert ensure_network(wifi=FakeWifi(), boot_grace=1) is True
