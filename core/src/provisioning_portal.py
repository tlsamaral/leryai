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
  /* Identidade Lery: ciano (principal), menta (secundária), fundo gelo, fonte arredondada.
     Tudo inline de propósito: o celular está no hotspot do Lery, sem internet para buscar fontes/imagens. */
  :root {
    color-scheme: light dark;
    --cyan:#14b8d4; --mint:#4de0b4;
    --bg:#f3f8fa; --card:#ffffff; --fg:#12303a; --muted:#587783; --line:#d9e9ee;
    --soft:rgba(20,184,212,.12); --danger-bg:#fdecec; --danger-fg:#8a1c1c; --ok-bg:#e4f8f0; --ok-fg:#0c5a42;
    --on-accent:#06303a;
  }
  @media (prefers-color-scheme: dark) {
    :root { --bg:#0b1a20; --card:#12272f; --fg:#e8f6f9; --muted:#8fb0ba; --line:#21404a;
            --soft:rgba(20,184,212,.18); --danger-bg:#3a1618; --danger-fg:#ffb4b4; --ok-bg:#0f3a2e; --ok-fg:#9df1d2; }
  }
  * { box-sizing:border-box; }
  body { margin:0; padding:20px 16px 40px; background:var(--bg); color:var(--fg);
         font:16px/1.45 ui-rounded,"SF Pro Rounded","Nunito","Quicksand",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif; }
  main { max-width:420px; margin:0 auto; }
  .brand { display:flex; align-items:center; gap:12px; margin:4px 0 18px; }
  .ring { width:48px; height:48px; flex:none; animation:breathe 2.6s ease-in-out infinite; }
  @keyframes breathe { 0%,100% { opacity:.55; transform:scale(.94); } 50% { opacity:1; transform:scale(1); } }
  @media (prefers-reduced-motion: reduce) { .ring { animation:none; } }
  .brand b { font-size:24px; letter-spacing:.2px; }
  h1 { font-size:21px; line-height:1.25; margin:0 0 6px; }
  p.sub { margin:0 0 18px; color:var(--muted); }
  .card { background:var(--card); border:1px solid var(--line); border-radius:18px; overflow:hidden; margin-bottom:16px; }
  .net { display:flex; align-items:center; justify-content:space-between; gap:12px; width:100%; min-height:52px;
         padding:12px 16px; border:0; border-bottom:1px solid var(--line); background:none; color:inherit;
         font:inherit; text-align:left; cursor:pointer; }
  .net:last-child { border-bottom:0; }
  .net:focus-visible, input:focus-visible, button.go:focus-visible { outline:3px solid var(--cyan); outline-offset:-3px; }
  .net[aria-pressed=true] { background:var(--soft); box-shadow:inset 4px 0 0 var(--cyan); }
  .meta { color:var(--muted); font-size:14px; white-space:nowrap; }
  label { display:block; font-size:14px; color:var(--muted); margin:14px 16px 6px; }
  input[type=text], input[type=password] { display:block; width:calc(100% - 32px); min-height:48px; margin:0 16px 8px; padding:12px 14px;
         font:inherit; border:1px solid var(--line); border-radius:12px; background:var(--bg); color:inherit; }
  .row { display:flex; align-items:center; gap:10px; margin:2px 16px 16px; color:var(--muted); font-size:14px; }
  .row input { width:20px; height:20px; accent-color:var(--cyan); }
  .row label { margin:0; }
  button.go { display:block; width:100%; min-height:52px; border:0; border-radius:14px; cursor:pointer;
              background:linear-gradient(135deg,var(--cyan),var(--mint)); color:var(--on-accent); font:700 17px ui-rounded,system-ui,sans-serif; }
  button.go:disabled { opacity:.55; cursor:default; }
  #msg { display:none; padding:14px 16px; border-radius:14px; }
  #msg.err { display:block; background:var(--danger-bg); color:var(--danger-fg); }
  #msg.ok { display:block; background:var(--ok-bg); color:var(--ok-fg); }
  #done { display:none; }
  #done h2 { font-size:19px; margin:0 0 8px; }
  #done ol { margin:8px 0 0; padding-left:20px; }
  #done li { margin:6px 0; }
  .note { margin:18px 4px 0; font-size:13px; color:var(--muted); text-align:center; }
</style>
</head>
<body>
<main>
  <div class="brand">
    <svg class="ring" viewBox="0 0 48 48" aria-hidden="true">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14b8d4"/><stop offset="1" stop-color="#4de0b4"/></linearGradient></defs>
      <circle cx="24" cy="24" r="17" fill="none" stroke="url(#g)" stroke-width="6"/>
    </svg>
    <b>Lery</b>
  </div>

  <div id="setup">
    <h1>Vamos conectar o Lery ao seu Wi-Fi</h1>
    <p class="sub">Sem pressa. Escolha a rede da sua casa e digite a senha.</p>

    <div class="card" id="nets"><div class="net"><span class="meta">Procurando redes…</span></div></div>

    <form id="form" class="card" autocomplete="off">
      <label for="ssid">Nome da rede (SSID)</label>
      <input type="text" id="ssid" required maxlength="32" autocapitalize="none" autocorrect="off">
      <label for="pw">Senha</label>
      <input type="password" id="pw" maxlength="63" autocapitalize="none" autocorrect="off">
      <div class="row"><input type="checkbox" id="show"><label for="show">Mostrar senha</label></div>
      <div style="padding:0 16px 16px"><button class="go" id="go" type="submit">Conectar</button></div>
    </form>
    <div id="msg" role="status"></div>
    <p class="note">O Lery só usa redes Wi-Fi de 2.4&nbsp;GHz.</p>
  </div>

  <div id="done" class="card" style="padding:18px 16px">
    <h2>Tudo certo, estou conectando…</h2>
    <ol>
      <li>Este Wi-Fi do Lery vai sumir. É normal.</li>
      <li>Seu celular volta sozinho para a sua rede.</li>
      <li>Quando o Lery disser <b>“I’m connected”</b>, é só falar <b>“Hey Lery”</b>.</li>
    </ol>
    <p class="note" style="text-align:left;margin:14px 0 0">Se o Wi-Fi <b>Lery-Setup</b> voltar, a senha provavelmente estava errada. Entre nele e tente de novo.</p>
  </div>
</main>
<script>
const $ = (id) => document.getElementById(id);
const msg = (text, cls) => { $('msg').textContent = text; $('msg').className = cls; };
const finish = () => { $('setup').style.display = 'none'; $('done').style.display = 'block'; window.scrollTo(0, 0); };

fetch('/networks').then(r => r.json()).then(list => {
  const box = $('nets');
  box.textContent = '';
  if (!list.length) {
    const d = document.createElement('div'); d.className = 'net';
    const t = document.createElement('span'); t.className = 'meta';
    t.textContent = 'Nenhuma rede encontrada. Digite o nome abaixo.';
    d.appendChild(t); box.appendChild(d); return;
  }
  list.forEach(n => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'net'; b.setAttribute('aria-pressed', 'false');
    const name = document.createElement('span'); name.textContent = n.ssid;   // textContent: SSIDs are untrusted
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
    if (!res.ok) { msg(data.error || 'Não consegui enviar. Tente de novo.', 'err'); $('go').disabled = false; return; }
    finish();
  } catch (err) {
    finish();  // the hotspot usually drops before the reply arrives — that means it worked
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
