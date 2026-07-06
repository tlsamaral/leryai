import sys
import os
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../../src'))

from api_client import ApiClient, create_api_client


@pytest.mark.unit
class TestCreateApiClient:
    def test_returns_none_when_url_missing(self, monkeypatch):
        monkeypatch.delenv('LERY_API_URL', raising=False)
        monkeypatch.setenv('LERY_DEVICE_API_KEY', 'key')
        assert create_api_client() is None

    def test_returns_none_when_key_missing(self, monkeypatch):
        monkeypatch.setenv('LERY_API_URL', 'http://localhost:3333')
        monkeypatch.delenv('LERY_DEVICE_API_KEY', raising=False)
        assert create_api_client() is None

    def test_returns_none_when_both_missing(self, monkeypatch):
        monkeypatch.delenv('LERY_API_URL', raising=False)
        monkeypatch.delenv('LERY_DEVICE_API_KEY', raising=False)
        assert create_api_client() is None

    def test_returns_instance_when_both_set(self, monkeypatch):
        monkeypatch.setenv('LERY_API_URL', 'http://localhost:3333')
        monkeypatch.setenv('LERY_DEVICE_API_KEY', 'device-key')
        client = create_api_client()
        assert isinstance(client, ApiClient)

    def test_instance_sets_base_url(self, monkeypatch):
        monkeypatch.setenv('LERY_API_URL', 'http://localhost:3333/')
        monkeypatch.setenv('LERY_DEVICE_API_KEY', 'key')
        client = create_api_client()
        assert client.base_url == 'http://localhost:3333'

    def test_instance_sets_auth_header(self, monkeypatch):
        monkeypatch.setenv('LERY_API_URL', 'http://localhost:3333')
        monkeypatch.setenv('LERY_DEVICE_API_KEY', 'my-secret')
        client = create_api_client()
        assert client._headers['Authorization'] == 'Bearer my-secret'
