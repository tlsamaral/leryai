"""
Screen border LED visualizer — desktop development mode.

Renders animated colored borders around the screen to simulate the
physical LED ring on the Raspberry Pi.  The Tk window runs inside a
subprocess so that macOS Cocoa's "Tk must live on the main thread"
requirement is satisfied without touching the AI pipeline's threads.

Drop-in replacement for LEDController:
    visualizer = ScreenBorderVisualizer()
    visualizer.set_state('LISTENING')
    visualizer.cleanup()
"""

from __future__ import annotations

import math
from multiprocessing import Process, Queue
from queue import Empty


# ── Palette (RGB tuples mirror the hardware LED colors in led_controller.py) ─

_PALETTES: dict[str, dict] = {
    'IDLE':      {'rgb': (20,   0,  50), 'anim': 'idle',    'speed': 0.4},
    'LISTENING': {'rgb': (180, 160,  0), 'anim': 'pulse',   'speed': 1.2},
    'THINKING':  {'rgb': (0,  150,  60), 'anim': 'breathe', 'speed': 1.8},
    'SPEAKING':  {'rgb': (0,   60, 160), 'anim': 'wave',    'speed': 2.0},
    'ERROR':     {'rgb': (160,   0,  0), 'anim': 'flash',   'speed': 6.0},
}

_BORDER_PX = 14   # border thickness in pixels
_FPS       = 30   # animation frame rate


# ── Helpers ──────────────────────────────────────────────────────────────────

def _hex(r: int, g: int, b: int) -> str:
    return f'#{r:02x}{g:02x}{b:02x}'


def _scale(rgb: tuple[int, int, int], factor: float) -> str:
    r, g, b = rgb
    return _hex(min(255, int(r * factor)),
                min(255, int(g * factor)),
                min(255, int(b * factor)))


# ── Subprocess entry point ───────────────────────────────────────────────────

def _run_border_window(state_queue: Queue) -> None:
    """
    Runs entirely inside the subprocess — Tk mainloop lives here.
    Must be a module-level function so multiprocessing (spawn method)
    can pickle the target.
    """
    import tkinter as tk

    root = tk.Tk()
    root.overrideredirect(True)          # no title bar or chrome

    sw = root.winfo_screenwidth()
    sh = root.winfo_screenheight()
    root.geometry(f'{sw}x{sh}+0+0')

    # Black background becomes fully transparent on macOS/Windows
    root.configure(bg='black')
    root.wm_attributes('-transparentcolor', 'black')
    root.wm_attributes('-topmost', True)

    canvas = tk.Canvas(root, width=sw, height=sh, bg='black', highlightthickness=0)
    canvas.pack()

    B = _BORDER_PX
    # Order: top, right, bottom, left — same order used for wave phase offsets
    rects = [
        canvas.create_rectangle(0,    0,    sw,   B,    fill='black', outline=''),
        canvas.create_rectangle(sw-B, 0,    sw,   sh,   fill='black', outline=''),
        canvas.create_rectangle(0,    sh-B, sw,   sh,   fill='black', outline=''),
        canvas.create_rectangle(0,    0,    B,    sh,   fill='black', outline=''),
    ]

    current_state = ['IDLE']
    frame        = [0]

    def drain() -> None:
        try:
            while True:
                current_state[0] = state_queue.get_nowait()
        except Empty:
            pass

    def tick() -> None:
        drain()

        state   = current_state[0]
        palette = _PALETTES.get(state, _PALETTES['IDLE'])
        rgb     = palette['rgb']
        anim    = palette['anim']
        speed   = palette['speed']
        t       = frame[0] / _FPS      # elapsed seconds

        # ── IDLE: very dim slow pulse — "I'm alive" ──────────────────────────
        if anim == 'idle':
            factor = 0.06 + 0.10 * (0.5 + 0.5 * math.sin(t * speed * math.tau))
            c = _scale(rgb, factor)
            for r in rects:
                canvas.itemconfig(r, fill=c)

        # ── PULSE (LISTENING) / BREATHE (THINKING) ──────────────────────────
        elif anim in ('pulse', 'breathe'):
            lo = 0.20 if anim == 'pulse' else 0.35
            factor = lo + (1.0 - lo) * (0.5 + 0.5 * math.sin(t * speed * math.tau))
            c = _scale(rgb, factor)
            for r in rects:
                canvas.itemconfig(r, fill=c)

        # ── WAVE (SPEAKING): glow travels clockwise ──────────────────────────
        elif anim == 'wave':
            # Phase offsets: top=0, right=π/2, bottom=π, left=3π/2
            phases = [0.0, math.pi / 2, math.pi, 3 * math.pi / 2]
            for i, r in enumerate(rects):
                factor = 0.15 + 0.85 * (0.5 + 0.5 * math.sin(
                    t * speed * math.tau + phases[i]
                ))
                canvas.itemconfig(r, fill=_scale(rgb, factor))

        # ── FLASH (ERROR) ────────────────────────────────────────────────────
        elif anim == 'flash':
            on = int(t * speed * 2) % 2 == 0
            c  = _hex(*rgb) if on else 'black'
            for r in rects:
                canvas.itemconfig(r, fill=c)

        frame[0] += 1
        root.after(1000 // _FPS, tick)

    tick()
    root.mainloop()


# ── Public class ─────────────────────────────────────────────────────────────

class ScreenBorderVisualizer:
    """
    Desktop LED ring replacement.  Starts a subprocess that owns the Tk
    window and communicates state via a multiprocessing Queue.

    Matches LEDController interface: set_state(state), cleanup().
    """

    def __init__(self) -> None:
        self._queue: Queue = Queue()
        self._process = Process(
            target=_run_border_window,
            args=(self._queue,),
            daemon=True,
            name='lery-screen-border',
        )
        self._process.start()
        print('[ScreenBorder] Overlay started — desktop mode')

    def set_state(self, state: str) -> None:
        """Thread-safe. Drops stale entries so window always shows latest state."""
        try:
            # Clear queue so stale intermediate states don't pile up
            while not self._queue.empty():
                try:
                    self._queue.get_nowait()
                except Empty:
                    break
            self._queue.put_nowait(state)
        except Exception:
            pass

    def cleanup(self) -> None:
        try:
            self._process.terminate()
            self._process.join(timeout=1)
        except Exception:
            pass
        print('[ScreenBorder] Overlay stopped')
