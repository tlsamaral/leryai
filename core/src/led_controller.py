import threading
import time
import math

try:
    from rpi_ws281x import PixelStrip, Color
    HAS_NEOPIXEL = True
except ImportError:
    HAS_NEOPIXEL = False
    def Color(r, g, b): return (r << 16) | (g << 8) | b

try:
    import RPi.GPIO as GPIO
    HAS_GPIO = True
except ImportError:
    HAS_GPIO = False

# LED ring configuration
LED_COUNT      = 12
LED_PIN        = 18
LED_FREQ_HZ    = 800000
LED_DMA        = 10
LED_BRIGHTNESS = 80       # Tom mais suave (max 255)
LED_INVERT     = False
LED_CHANNEL    = 0

# Cores suaves (R, G, B)
COLORS = {
    'IDLE':      (0, 0, 0),         # Apagado
    'LISTENING': (180, 160, 0),     # Amarelo suave — pulsante
    'THINKING':  (0, 150, 60),      # Verde suave — estático
    'SPEAKING':  (0, 60, 160),      # Azul suave — estático
    'ERROR':     (160, 0, 0),       # Vermelho suave
}


class LEDController:
    def __init__(self):
        self.is_embedded = HAS_NEOPIXEL or HAS_GPIO
        self.strip = None
        self._animation_thread = None
        self._stop_animation = threading.Event()

        if HAS_NEOPIXEL:
            try:
                self.strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
                self.strip.begin()
            except (RuntimeError, OSError) as e:
                print(f"[LED] Failed to initialize NeoPixel: {e}")
                print("[LED] Running in debug mode (no hardware LED)")
                self.strip = None
                self.is_embedded = False
        elif HAS_GPIO:
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(LED_PIN, GPIO.OUT)
            GPIO.output(LED_PIN, GPIO.LOW)

    def _stop_current_animation(self):
        self._stop_animation.set()
        if self._animation_thread and self._animation_thread.is_alive():
            self._animation_thread.join(timeout=1)
        self._stop_animation.clear()

    def _set_all_pixels(self, r, g, b):
        if HAS_NEOPIXEL and self.strip:
            color = Color(r, g, b)
            for i in range(self.strip.numPixels()):
                self.strip.setPixelColor(i, color)
            self.strip.show()

    def _pulse_loop(self, base_r, base_g, base_b):
        """Pulsação suave usando seno. Varia o brilho de 20% a 100%."""
        t = 0.0
        while not self._stop_animation.is_set():
            factor = 0.2 + 0.8 * (0.5 + 0.5 * math.sin(t))
            r = int(base_r * factor)
            g = int(base_g * factor)
            b = int(base_b * factor)
            self._set_all_pixels(r, g, b)
            t += 0.1
            time.sleep(0.03)

    def set_state(self, state):
        self._stop_current_animation()

        color = COLORS.get(state, COLORS['IDLE'])
        r, g, b = color

        state_labels = {
            'IDLE': 'Idle',
            'LISTENING': 'Listening',
            'THINKING': 'Thinking',
            'SPEAKING': 'Speaking',
            'ERROR': 'Error',
        }
        label = state_labels.get(state, 'Unknown')
        print(f"[LED: {state} - {label}]")

        if not self.is_embedded:
            return

        if state == 'IDLE':
            self._set_all_pixels(0, 0, 0)
            if HAS_GPIO:
                GPIO.output(LED_PIN, GPIO.LOW)

        elif state == 'LISTENING':
            # Pulsação amarela em thread separada
            self._animation_thread = threading.Thread(
                target=self._pulse_loop, args=(r, g, b), daemon=True
            )
            self._animation_thread.start()

        else:
            # THINKING, SPEAKING, ERROR — cor estática
            self._set_all_pixels(r, g, b)
            if HAS_GPIO:
                GPIO.output(LED_PIN, GPIO.HIGH)
