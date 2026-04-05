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
        self.strip = None
        self.use_gpio = False
        self.current_state = 'IDLE'

        if HAS_NEOPIXEL:
            try:
                self.strip = PixelStrip(LED_COUNT, LED_PIN, LED_FREQ_HZ, LED_DMA, LED_INVERT, LED_BRIGHTNESS, LED_CHANNEL)
                self.strip.begin()
            except (RuntimeError, OSError) as e:
                print(f"[LED] Failed to initialize NeoPixel: {e}")
                print("[LED] Running in debug mode (no hardware LED)")
                self.strip = None

        if not self.strip and HAS_GPIO:
            try:
                GPIO.setmode(GPIO.BCM)
                GPIO.setup(LED_PIN, GPIO.OUT)
                GPIO.output(LED_PIN, GPIO.LOW)
                self.use_gpio = True
            except RuntimeError as e:
                print(f"[LED] Failed to initialize GPIO: {e}")

        self.is_embedded = self.strip is not None or self.use_gpio

        # Start a single persistent background thread for LED animations
        if self.is_embedded:
            self._running = True
            self._thread = threading.Thread(target=self._led_worker, daemon=True)
            self._thread.start()

    def _set_all_pixels(self, r, g, b):
        if HAS_NEOPIXEL and self.strip:
            color = Color(r, g, b)
            for i in range(self.strip.numPixels()):
                self.strip.setPixelColor(i, color)
            self.strip.show()

    def _led_worker(self):
        t = 0.0
        last_state = None
        
        while self._running:
            state = self.current_state
            r, g, b = COLORS.get(state, COLORS['IDLE'])
            
            if state == 'LISTENING':
                # Pulsação suave
                factor = 0.2 + 0.8 * (0.5 + 0.5 * math.sin(t))
                cur_r = int(r * factor)
                cur_g = int(g * factor)
                cur_b = int(b * factor)
                self._set_all_pixels(cur_r, cur_g, cur_b)
                t += 0.1
                time.sleep(0.03)
            else:
                # Estático (ou apagado)
                # Só atualiza a fita se o estado mudou ou se voltamos ao estático
                if state != last_state:
                    if state == 'IDLE':
                        self._set_all_pixels(0, 0, 0)
                        if self.use_gpio:
                            GPIO.output(LED_PIN, GPIO.LOW)
                    else:
                        self._set_all_pixels(r, g, b)
                        if self.use_gpio:
                            GPIO.output(LED_PIN, GPIO.HIGH)
                
                # Se não estiver animando, descansa um pouco mais pra não gastar CPU atoa
                time.sleep(0.1)
                
            last_state = state

    def set_state(self, state):
        self.current_state = state
        
        state_labels = {
            'IDLE': 'Idle',
            'LISTENING': 'Listening',
            'THINKING': 'Thinking',
            'SPEAKING': 'Speaking',
            'ERROR': 'Error',
        }
        label = state_labels.get(state, 'Unknown')
        print(f"[LED: {state} - {label}]")

    def cleanup(self):
        """Forcefully turns off the LED and stops the background worker thread."""
        if self.is_embedded:
            self._running = False
            if hasattr(self, '_thread') and self._thread.is_alive():
                self._thread.join(timeout=0.5)
            self._set_all_pixels(0, 0, 0)
            if self.use_gpio:
                GPIO.output(LED_PIN, GPIO.LOW)

