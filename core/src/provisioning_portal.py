from __future__ import annotations

import json
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Callable, List, Optional
from urllib.parse import parse_qs

_MAX_BODY_BYTES = 4096

_PAGE = """<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Lery · Conectar ao Wi-Fi</title>
<style>
  :root { color-scheme: light dark; --bg:#f6f5fb; --card:#fff; --fg:#1b1930; --muted:#6c6a80; --line:#e3e1ee; --accent:#5b3df5; }
  @media (prefers-color-scheme: dark) { :root { --bg:#14121f; --card:#1e1b2e; --fg:#f1effa; --muted:#9a97b3; --line:#2f2b45; } }
  * { box-sizing: border-box; }
  body { margin:0; padding:16px; background:var(--bg); color:var(--fg); font:16px/1.4 system-ui,-apple-system,sans-serif; }
  main { max-width:420px; margin:0 auto; }
  h1 { font-size:22px; margin:8px 0 4px; }
  p.sub { margin:0 0 16px; color:var(--muted); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:14px; overflow:hidden; margin-bottom:16px; }
  .net { display:flex; justify-content:space-between; width:100%; padding:14px 16px; border:0; border-bottom:1px solid var(--line);
         background:none; color:inherit; font:inherit; text-align:left; cursor:pointer; }
  .net:last-child { border-bottom:0; }
  .net[aria-pressed=true] { background:color-mix(in srgb, var(--accent) 14%, transparent); }
  .meta { color:var(--muted); font-size:14px; }
  label { display:block; font-size:14px; color:var(--muted); margin:12px 16px 4px; }
  input[type=text], input[type=password] { width:calc(100% - 32px); margin:0 16px 8px; padding:12px; font:inherit;
         border:1px solid var(--line); border-radius:10px; background:var(--bg); color:inherit; }
  .row { display:flex; align-items:center; gap:8px; margin:0 16px 14px; color:var(--muted); font-size:14px; }
  button.go { width:100%; padding:14px; border:0; border-radius:12px; background:var(--accent); color:#fff; font:600 16px system-ui; cursor:pointer; }
  button.go:disabled { opacity:.5; }
  #msg { margin-top:14px; padding:12px 14px; border-radius:12px; display:none; }
  #msg.err { display:block; background:#fde8e8; color:#8a1c1c; }
  #msg.ok { display:block; background:#e6f6ec; color:#16603a; }
</style>
</head>
<body>
<main>
  <h1>Conectar o Lery ao Wi-Fi</h1>
  <p class="sub">Escolha a rede da sua casa. O Lery só usa redes de 2.4&nbsp;GHz.</p>
  <div class="card" id="nets"><div class="net"><span class="meta">Procurando redes…</span></div></div>
  <form id="form" class="card" autocomplete="off">
    <label for="ssid">Nome da rede (SSID)</label>
    <input type="text" id="ssid" required maxlength="32" autocapitalize="none" autocorrect="off">
    <label for="pw">Senha</label>
    <input type="password" id="pw" maxlength="63" autocapitalize="none" autocorrect="off">
    <div class="row"><input type="checkbox" id="show"><label for="show" style="margin:0">Mostrar senha</label></div>
    <div style="padding:0 16px 16px"><button class="go" id="go" type="submit">Conectar</button></div>
  </form>
  <div id="msg"></div>
</main>
<script>
const $ = (id) => document.getElementById(id);
const msg = (text, cls) => { $('msg').textContent = text; $('msg').className = cls; };

fetch('/networks').then(r => r.json()).then(list => {
  const box = $('nets');
  box.textContent = '';
  if (!list.length) {
    const d = document.createElement('div'); d.className = 'net';
    d.innerHTML = '<span class="meta">Nenhuma rede encontrada — digite o nome abaixo.</span>';
    box.appendChild(d); return;
  }
  list.forEach(n => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'net'; b.setAttribute('aria-pressed', 'false');
    const name = document.createElement('span'); name.textContent = n.ssid;
    const meta = document.createElement('span'); meta.className = 'meta';
    meta.textContent = (n.secure ? '🔒 ' : '') + n.signal + '%';
    b.append(name, meta);
    b.onclick = () => {
      document.querySelectorAll('.net').forEach(x => x.setAttribute('aria-pressed', 'false'));
      b.setAttribute('aria-pressed', 'true');
      $('ssid').value = n.ssid; $('pw').focus();
    };
    box.appendChild(b);
  });
}).catch(() => {});

$('show').onchange = (e) => { $('pw').type = e.target.checked ? 'text' : 'password'; };

$('form').onsubmit = async (e) => {
  e.preventDefault();
  $('go').disabled = true;
  try {
    const res = await fetch('/connect', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ssid: $('ssid').value, password: $('pw').value}),
    });
    const data = await res.json();
    if (!res.ok) { msg(data.error || 'Erro ao enviar.', 'err'); $('go').disabled = false; return; }
    msg('Conectando… O Wi-Fi do Lery vai sumir agora. Quando ele falar "connected", está pronto. ' +
        'Se o Wi-Fi Lery-Setup voltar, a senha provavelmente estava errada — tente de novo.', 'ok');
  } catch (err) {
    msg('Conectando… se o Wi-Fi do Lery sumiu, é normal. Aguarde o Lery avisar.', 'ok');
  }
};
</script>
</body>
</html>
"""


def validate_credentials(ssid: object, password: object) -> Optional[str]:
    """Returns an error message (pt-BR) or None when the credentials look valid."""
    if not isinstance(ssid, str) or not isinstance(password, str):
        return 'Dados inválidos.'
    if not 1 <= len(ssid.encode()) <= 32:
        return 'O nome da rede deve ter entre 1 e 32 caracteres.'
    if password and not 8 <= len(password) <= 64:
        return 'A senha deve ter entre 8 e 63 caracteres.'
    return None


class ProvisioningPortal:
    """
    Tiny captive portal served while Lery is in hotspot mode.

    Every unknown GET returns the setup page, so the OS captive-portal probes
    (Android /generate_204, Apple /hotspot-detect.html, Windows /connecttest.txt)
    all pop the page open on their own.
    """

    def __init__(
        self,
        networks: Callable[[], List[dict]],
        on_credentials: Callable[[str, str], None],
        host: str = '0.0.0.0',
        port: int = 80,
    ):
        self._networks = networks
        self._on_credentials = on_credentials
        self._host = host
        self._port = port
        self._server: Optional[ThreadingHTTPServer] = None
        self._thread: Optional[threading.Thread] = None
        self.last_activity = 0.0

    @property
    def port(self) -> int:
        return self._server.server_address[1] if self._server else self._port

    def start(self) -> None:
        portal = self

        class Handler(BaseHTTPRequestHandler):
            def log_message(self, *_args):  # never log requests — bodies hold the password
                pass

            def _send(self, status: int, body: bytes, content_type: str) -> None:
                self.send_response(status)
                self.send_header('Content-Type', content_type)
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Cache-Control', 'no-store')
                self.end_headers()
                self.wfile.write(body)

            def _json(self, status: int, payload: object) -> None:
                self._send(status, json.dumps(payload).encode(), 'application/json')

            def do_GET(self):
                portal.last_activity = time.monotonic()
                if self.path.split('?')[0] == '/networks':
                    self._json(200, portal._networks())
                else:
                    self._send(200, _PAGE.encode(), 'text/html; charset=utf-8')

            def do_POST(self):
                portal.last_activity = time.monotonic()
                if self.path.split('?')[0] != '/connect':
                    self._json(404, {'error': 'Not found'})
                    return

                length = int(self.headers.get('Content-Length') or 0)
                if length <= 0 or length > _MAX_BODY_BYTES:
                    self._json(400, {'error': 'Dados inválidos.'})
                    return

                raw = self.rfile.read(length).decode('utf-8', errors='replace')
                try:
                    if 'json' in (self.headers.get('Content-Type') or ''):
                        data = json.loads(raw)
                    else:
                        data = {k: v[0] for k, v in parse_qs(raw).items()}
                except (ValueError, TypeError):
                    self._json(400, {'error': 'Dados inválidos.'})
                    return

                ssid, password = data.get('ssid'), data.get('password', '')
                error = validate_credentials(ssid, password)
                if error:
                    self._json(400, {'error': error})
                    return

                # Reply first — the hotspot is torn down right after the hand-off.
                self._json(202, {'status': 'connecting'})
                portal._on_credentials(ssid, password)

        self._server = ThreadingHTTPServer((self._host, self._port), Handler)
        self._server.daemon_threads = True
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True, name='lery-portal')
        self._thread.start()
        print(f'[Portal] listening on {self._host}:{self.port}')

    def stop(self) -> None:
        if self._server:
            self._server.shutdown()
            self._server.server_close()
            self._server = None
        if self._thread:
            self._thread.join(timeout=2)
            self._thread = None
