"""
Screen border LED visualizer — desktop development mode.

Two-layer neon effect:
  • Bloom — wide soft Gaussian halo (state color)
  • Core  — tight bright ring right at the edge, tinted near-white
            like a real neon tube with a glowing filament

macOS primary: single transparent, click-through, always-on-top
NSWindow via AppKit.

Fallback (SDL2): 8 borderless always-on-top windows, bloom + core
drawn as two textures with additive blending.
"""

from __future__ import annotations

import math
import platform
from multiprocessing import Process, Queue
from queue import Empty

# ── Palette ────────────────────────────────────────────────────────────────────

_PALETTES: dict = {
    # bloom_op: opacity of the wide soft halo
    # core_op:  opacity of the tight bright edge ring
    'IDLE':      {'rgb': (60,   0, 120), 'anim': 'idle',    'speed': 0.35, 'bloom_op': 0.18, 'core_op': 0.25},
    'LISTENING': {'rgb': (220, 180,   0), 'anim': 'pulse',   'speed': 1.1,  'bloom_op': 0.35, 'core_op': 0.55},
    'THINKING':  {'rgb': (0,   190,  70), 'anim': 'breathe', 'speed': 1.6,  'bloom_op': 0.30, 'core_op': 0.50},
    'SPEAKING':  {'rgb': (0,    80, 220), 'anim': 'wave',    'speed': 2.2,  'bloom_op': 0.35, 'core_op': 0.55},
    'ERROR':     {'rgb': (220,  20,  20), 'anim': 'flash',   'speed': 5.0,  'bloom_op': 0.45, 'core_op': 0.70},
}

_GLOW_SIZE  = 120   # px — bloom band width
_GLOW_DECAY = 2.5   # soft Gaussian for bloom
_CORE_SIZE  = 20    # px — tight neon core width
_CORE_DECAY = 9.0   # sharp Gaussian for core
_FPS        = 30
_IS_MACOS   = platform.system() == 'Darwin'


# ── Animation math ─────────────────────────────────────────────────────────────

def _compute_factor(anim: str, speed: float, t: float) -> float:
    tau = math.tau
    if anim == 'idle':
        return 0.04 + 0.08 * (0.5 + 0.5 * math.sin(t * speed * tau))
    elif anim == 'pulse':
        return 0.15 + 0.85 * (0.5 + 0.5 * math.sin(t * speed * tau))
    elif anim == 'breathe':
        return 0.25 + 0.75 * (0.5 + 0.5 * math.sin(t * speed * tau))
    elif anim == 'wave':
        return 0.15 + 0.85 * (0.5 + 0.5 * math.sin(t * speed * tau))
    elif anim == 'flash':
        return 1.0 if int(t * speed * 2) % 2 == 0 else 0.0
    return 0.5


# ── macOS native overlay (AppKit) ─────────────────────────────────────────────

def _run_macos_overlay(state_queue: Queue) -> None:
    from AppKit import (
        NSApplication, NSBezierPath, NSColor, NSScreen, NSView, NSWindow,
    )
    from Foundation import NSDate, NSRunLoop

    app = NSApplication.sharedApplication()
    app.setActivationPolicy_(1)  # Accessory — no Dock icon

    screen = NSScreen.mainScreen()
    frame  = screen.frame()
    sw     = int(frame.size.width)
    sh     = int(frame.size.height)

    # ── Pre-compute ring lists ─────────────────────────────────────────────────

    # Bloom: wide, step=2px strokes — radius=0 so glow fills screen corners
    bloom_step  = 2
    bloom_rings: list = []
    for i in range(0, _GLOW_SIZE, bloom_step):
        n     = i / _GLOW_SIZE
        alpha = math.exp(-(n * n) * _GLOW_DECAY)
        if alpha < 0.008:
            break
        w = sw - 2 * i
        h = sh - 2 * i
        if w <= 2 or h <= 2:
            break
        bloom_rings.append((i, w, h, 0.0, alpha))

    # Core: tight, step=1px strokes, stays within CORE_SIZE
    core_step  = 1
    core_rings: list = []
    for i in range(0, _CORE_SIZE, core_step):
        n     = i / _CORE_SIZE
        alpha = math.exp(-(n * n) * _CORE_DECAY)
        if alpha < 0.005:
            break
        w = sw - 2 * i
        h = sh - 2 * i
        if w <= 2 or h <= 2:
            break
        core_rings.append((i, w, h, 0.0, alpha))

    state_holder = ['IDLE']
    frame_num    = [0]
    view_ref: list = [None]

    class GlowView(NSView):
        def isOpaque(self):
            return False

        def drawRect_(self, dirtyRect):
            pal      = _PALETTES.get(state_holder[0], _PALETTES['IDLE'])
            rgb      = pal['rgb']
            bloom_op = pal.get('bloom_op', 0.3)
            core_op  = pal.get('core_op', 0.5)
            anim     = pal['anim']
            speed    = pal['speed']
            t        = frame_num[0] / _FPS
            factor   = _compute_factor(anim, speed, t)

            r, g, b  = rgb[0] / 255.0, rgb[1] / 255.0, rgb[2] / 255.0

            # Core tint: blend 60% towards white for the hot filament look
            cr = r + (1.0 - r) * 0.60
            cg = g + (1.0 - g) * 0.60
            cb = b + (1.0 - b) * 0.60

            if anim == 'wave':
                # ── True clockwise wave: each side has its own phase ───────────
                # Phase offsets: top=0, right=π/2, bottom=π, left=3π/2
                # Subtract phase so peak sweeps clockwise (top → right → bottom → left)
                tau = math.tau
                side_f = [
                    0.10 + 0.90 * (0.5 + 0.5 * math.sin(t * speed * tau)),
                    0.10 + 0.90 * (0.5 + 0.5 * math.sin(t * speed * tau - math.pi / 2)),
                    0.10 + 0.90 * (0.5 + 0.5 * math.sin(t * speed * tau - math.pi)),
                    0.10 + 0.90 * (0.5 + 0.5 * math.sin(t * speed * tau - 3 * math.pi / 2)),
                ]

                def _draw_sides(rings_list, lw, col_r, col_g, col_b, op):
                    for (inset, w, h, radius, base_alpha) in rings_list:
                        # Extend lines by half line-width so adjacent sides meet at corners
                        ext = lw / 2.0
                        segs = [
                            # (side_factor_idx, x1, y1, x2, y2)
                            (0, inset - ext,  sh - inset, sw - inset + ext, sh - inset),  # top
                            (1, sw - inset,   sh - inset + ext, sw - inset, inset - ext), # right
                            (2, sw - inset + ext, inset,  inset - ext,  inset),           # bottom
                            (3, inset,        inset - ext, inset, sh - inset + ext),      # left
                        ]
                        for (si, x1, y1, x2, y2) in segs:
                            a = base_alpha * side_f[si] * op
                            if a < 0.004:
                                continue
                            NSColor.colorWithCalibratedRed_green_blue_alpha_(
                                col_r, col_g, col_b, a
                            ).setStroke()
                            seg = NSBezierPath.bezierPath()
                            seg.moveToPoint_((x1, y1))
                            seg.lineToPoint_((x2, y2))
                            seg.setLineWidth_(lw)
                            seg.stroke()

                _draw_sides(bloom_rings, float(bloom_step), r, g, b, bloom_op)
                _draw_sides(core_rings,  float(core_step),  cr, cg, cb, core_op)

            else:
                # ── All other states: full rounded-rect rings (fast) ───────────
                # Pass 1 — bloom
                for (inset, w, h, radius, base_alpha) in bloom_rings:
                    a = base_alpha * factor * bloom_op
                    if a < 0.004:
                        continue
                    NSColor.colorWithCalibratedRed_green_blue_alpha_(
                        r, g, b, a
                    ).setStroke()
                    path = NSBezierPath.bezierPathWithRoundedRect_xRadius_yRadius_(
                        ((inset, inset), (w, h)), radius, radius,
                    )
                    path.setLineWidth_(float(bloom_step))
                    path.stroke()

                # Pass 2 — core
                for (inset, w, h, radius, base_alpha) in core_rings:
                    a = base_alpha * factor * core_op
                    if a < 0.004:
                        continue
                    NSColor.colorWithCalibratedRed_green_blue_alpha_(
                        cr, cg, cb, a
                    ).setStroke()
                    path = NSBezierPath.bezierPathWithRoundedRect_xRadius_yRadius_(
                        ((inset, inset), (w, h)), radius, radius,
                    )
                    path.setLineWidth_(float(core_step))
                    path.stroke()

    # ── Overlay window ─────────────────────────────────────────────────────────
    win = NSWindow.alloc().initWithContentRect_styleMask_backing_defer_(
        frame, 0, 2, False,
    )
    win.setLevel_(25)                    # NSStatusWindowLevel
    win.setBackgroundColor_(NSColor.clearColor())
    win.setOpaque_(False)
    win.setIgnoresMouseEvents_(True)     # click-through
    win.setHasShadow_(False)
    try:
        win.setCollectionBehavior_(1 << 0)  # canJoinAllSpaces
    except Exception:
        pass

    view = GlowView.alloc().initWithFrame_(frame)
    view_ref[0] = view
    win.setContentView_(view)
    win.orderFrontRegardless()

    print(
        f'[ScreenBorder] macOS overlay at {sw}×{sh} '
        f'({len(bloom_rings)} bloom + {len(core_rings)} core rings)',
        flush=True,
    )

    run_loop = NSRunLoop.currentRunLoop()
    interval = 1.0 / _FPS

    while True:
        run_loop.runUntilDate_(NSDate.dateWithTimeIntervalSinceNow_(interval))
        try:
            while True:
                state_holder[0] = state_queue.get_nowait()
        except Empty:
            pass
        frame_num[0] += 1
        view.setNeedsDisplay_(True)


# ── SDL2 fallback ──────────────────────────────────────────────────────────────

def _build_edge_surf(w: int, h: int, direction: str, decay: float):
    import pygame
    surf = pygame.Surface((w, h))
    surf.fill((0, 0, 0))
    try:
        import numpy as np
        if direction in ('top', 'bottom'):
            dist = np.arange(h, dtype=np.float32)
            if direction == 'bottom':
                dist = dist[::-1].copy()
            bri = np.clip(255 * np.exp(-((dist / h) ** 2) * decay), 0, 255).astype(np.uint8)
            arr = pygame.surfarray.pixels3d(surf)
            for c in range(3):
                arr[:, :, c] = bri[np.newaxis, :]
            del arr
        else:
            dist = np.arange(w, dtype=np.float32)
            if direction == 'right':
                dist = dist[::-1].copy()
            bri = np.clip(255 * np.exp(-((dist / w) ** 2) * decay), 0, 255).astype(np.uint8)
            arr = pygame.surfarray.pixels3d(surf)
            for c in range(3):
                arr[:, :, c] = bri[:, np.newaxis]
            del arr
    except Exception:
        if direction in ('top', 'bottom'):
            for i in range(h):
                d = i if direction == 'top' else h - 1 - i
                n = d / h
                b = int(255 * math.exp(-(n * n) * decay))
                pygame.draw.line(surf, (b, b, b), (0, i), (w - 1, i))
        else:
            for i in range(w):
                d = i if direction == 'left' else w - 1 - i
                n = d / w
                b = int(255 * math.exp(-(n * n) * decay))
                pygame.draw.line(surf, (b, b, b), (i, 0), (i, h - 1))
    return surf


def _build_corner_surf(G: int, corner: str, decay: float):
    import pygame
    surf = pygame.Surface((G, G))
    surf.fill((0, 0, 0))
    try:
        import numpy as np
        px, py = np.meshgrid(np.arange(G, dtype=np.float32),
                              np.arange(G, dtype=np.float32))
        if corner == 'tl':   dx, dy = px, py
        elif corner == 'tr': dx, dy = G - 1 - px, py
        elif corner == 'bl': dx, dy = px, G - 1 - py
        else:                dx, dy = G - 1 - px, G - 1 - py
        gh       = np.exp(-((dx / G) ** 2) * decay)
        gv       = np.exp(-((dy / G) ** 2) * decay)
        combined = 1.0 - (1.0 - gh) * (1.0 - gv)
        bri      = np.clip(combined * 255, 0, 255).astype(np.uint8)
        arr      = pygame.surfarray.pixels3d(surf)
        for c in range(3):
            arr[:, :, c] = bri.T
        del arr
    except Exception:
        for py_ in range(G):
            for px_ in range(G):
                if corner == 'tl':   cx, cy = px_, py_
                elif corner == 'tr': cx, cy = G - 1 - px_, py_
                elif corner == 'bl': cx, cy = px_, G - 1 - py_
                else:                cx, cy = G - 1 - px_, G - 1 - py_
                gn = cx / G; vn = cy / G
                gh = math.exp(-(gn * gn) * decay)
                gv = math.exp(-(vn * vn) * decay)
                combined = 1.0 - (1.0 - gh) * (1.0 - gv)
                surf.set_at((px_, py_), (int(255 * combined),) * 3)
    return surf


def _run_sdl2_overlay(state_queue: Queue) -> None:
    import os, sys
    os.environ['PYGAME_HIDE_SUPPORT_PROMPT'] = '1'
    try:
        import pygame
        from pygame._sdl2.video import Window, Renderer, Texture
    except Exception as e:
        print(f'[ScreenBorder] pygame/_sdl2 unavailable: {e}', file=sys.stderr)
        return

    pygame.init()
    info = pygame.display.Info()
    sw, sh = info.current_w, info.current_h
    G = _GLOW_SIZE

    edge_phases  = [0.0, math.pi / 2, math.pi, 3 * math.pi / 2]
    corner_phase = {
        'tl': (edge_phases[0] + edge_phases[3]) / 2,
        'tr': (edge_phases[0] + edge_phases[1]) / 2,
        'bl': (edge_phases[2] + edge_phases[3]) / 2,
        'br': (edge_phases[2] + edge_phases[1]) / 2,
    }

    if _IS_MACOS:
        edge_geoms = [
            (sw - 2*G, G,       G,      sh - G, 'top',    0),
            (G,        sh - 2*G, sw - G, G,     'right',  1),
            (sw - 2*G, G,       G,      0,      'bottom', 2),
            (G,        sh - 2*G, 0,     G,      'left',   3),
        ]
        corner_geoms = [
            (0, sh - G, 'tl'), (sw - G, sh - G, 'tr'),
            (0, 0,      'bl'), (sw - G, 0,      'br'),
        ]
    else:
        edge_geoms = [
            (sw - 2*G, G,       G,      0,      'top',    0),
            (G,        sh - 2*G, sw - G, G,     'right',  1),
            (sw - 2*G, G,       G,      sh - G, 'bottom', 2),
            (G,        sh - 2*G, 0,     G,      'left',   3),
        ]
        corner_geoms = [
            (0, 0,      'tl'), (sw - G, 0,      'tr'),
            (0, sh - G, 'bl'), (sw - G, sh - G, 'br'),
        ]

    print('[ScreenBorder] building SDL2 textures (bloom + core)...', flush=True)
    strips = []

    def _add(bloom_surf, core_surf, phase, w, h, x, y):
        try:
            win = Window(title='', size=(w, h), position=(x, y))
            win.borderless = True
            try:
                win.always_on_top = True
            except AttributeError:
                pass
            rend       = Renderer(win)
            tex_bloom  = Texture.from_surface(rend, bloom_surf)
            tex_core   = Texture.from_surface(rend, core_surf)
            # Additive blend for core — adds on top of bloom
            try:
                tex_core.blend_mode = 2   # SDL_BLENDMODE_ADD
            except Exception:
                pass
            strips.append({
                'rend': rend, 'tex_bloom': tex_bloom,
                'tex_core': tex_core, 'phase': phase,
            })
        except Exception as e:
            print(f'[ScreenBorder] window failed: {e}', file=sys.stderr)

    for (w, h, x, y, d, pi) in edge_geoms:
        _add(
            _build_edge_surf(w, h, d, _GLOW_DECAY),
            _build_edge_surf(w, h, d, _CORE_DECAY),
            edge_phases[pi], w, h, x, y,
        )
    for (x, y, c) in corner_geoms:
        _add(
            _build_corner_surf(G, c, _GLOW_DECAY),
            _build_corner_surf(G, c, _CORE_DECAY),
            corner_phase[c], G, G, x, y,
        )

    if not strips:
        pygame.quit()
        return

    print(f'[ScreenBorder] {len(strips)} SDL2 windows at {sw}×{sh}', flush=True)

    clock = pygame.time.Clock()
    state = ['IDLE']
    frame = [0]

    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                return
        try:
            while True:
                state[0] = state_queue.get_nowait()
        except Empty:
            pass

        palette  = _PALETTES.get(state[0], _PALETTES['IDLE'])
        rgb      = palette['rgb']
        anim     = palette['anim']
        speed    = palette['speed']
        bloom_op = palette.get('bloom_op', 0.3)
        core_op  = palette.get('core_op', 0.5)
        t        = frame[0] / _FPS

        for strip in strips:
            phase = strip['phase']
            if anim == 'wave':
                factor = 0.10 + 0.90 * (
                    0.5 + 0.5 * math.sin(t * speed * math.tau + phase))
            else:
                factor = _compute_factor(anim, speed, t)

            r, g, b = rgb
            # Core tint: blend towards white
            cr = int(r + (255 - r) * 0.60)
            cg = int(g + (255 - g) * 0.60)
            cb = int(b + (255 - b) * 0.60)

            try:
                bf = factor * bloom_op
                strip['tex_bloom'].color = (
                    min(255, int(r * bf)),
                    min(255, int(g * bf)),
                    min(255, int(b * bf)),
                )
                cf = factor * core_op
                strip['tex_core'].color = (
                    min(255, int(cr * cf)),
                    min(255, int(cg * cf)),
                    min(255, int(cb * cf)),
                )
                strip['rend'].draw_color = (0, 0, 0, 255)
                strip['rend'].clear()
                strip['tex_bloom'].draw()
                strip['tex_core'].draw()
                strip['rend'].present()
            except Exception:
                pass

        frame[0] += 1
        clock.tick(_FPS)


# ── Entry point (subprocess) ──────────────────────────────────────────────────

def _run_border_window(state_queue: Queue) -> None:
    if _IS_MACOS:
        try:
            _run_macos_overlay(state_queue)
            return
        except ImportError:
            print('[ScreenBorder] pyobjc not found — pip install pyobjc-framework-Cocoa', flush=True)
        except Exception as e:
            print(f'[ScreenBorder] macOS overlay failed ({e}), SDL2 fallback', flush=True)
    _run_sdl2_overlay(state_queue)


# ── Public class ──────────────────────────────────────────────────────────────

class ScreenBorderVisualizer:
    """
    Desktop LED ring replacement.
    Same interface as LEDController: set_state(state), cleanup().
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
        print('[ScreenBorder] overlay started — desktop mode')

    def set_state(self, state: str) -> None:
        try:
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
        print('[ScreenBorder] overlay stopped')
