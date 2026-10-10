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
LED_COUNT      = 16
LED_PIN        = 10       # Usando GPIO 10 (SPI MOSI) p/ evitar chiado no P2!
LED_FREQ_HZ    = 800000
LED_DMA        = 10
LED_BRIGHTNESS = 35       # Tom mais suave e discreto (max 255)
LED_INVERT     = False
LED_CHANNEL    = 0

# Cores suaves (R, G, B) — todas respiram exceto IDLE/ERROR
COLORS = {
    'IDLE':      (0, 0, 0),         # Apagado
    'LISTENING': (180, 160, 0),     # Amarelo suave — respirando
    'THINKING':  (0, 150, 60),      # Verde suave — respirando
    'SPEAKING':  (0, 60, 160),      # Azul suave — respirando
    'PROVISIONING': (0, 140, 170),  # Ciano — respirando, aguardando config. de Wi-Fi
    'ERROR':    (160, 0, 0),       # Vermelho — pisca rápido (urgente)
}

# Respiração (breathing) — usada em LISTENING / THINKING / SPEAKING
PULSE_PERIOD_SEC = 2.6     # tempo de um ciclo completo (inspira+expira)
PULSE_MIN_FACTOR = 0.08    # nunca apaga de verdade — evita "piscar"
PULSE_MAX_FACTOR = 1.0
PULSE_SHAPE      = 1.6     # >1 = detém mais tempo nos extremos (respiração orgânica)

# Blink de ERROR — intencionalmente diferente (urgência, não respiração)
ERROR_BLINK_HZ = 4.0

GPIO_PWM_FREQ_HZ = 200     # PWM por software (fallback sem rpi_ws281x)


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

        self._gpio_pwm = None
        if not self.strip and HAS_GPIO:
            try:
                GPIO.setmode(GPIO.BCM)
                GPIO.setup(LED_PIN, GPIO.OUT)
                self._gpio_pwm = GPIO.PWM(LED_PIN, GPIO_PWM_FREQ_HZ)
                self._gpio_pwm.start(0)
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
        elif self.use_gpio and self._gpio_pwm:
            # Sem fita endereçável — usa PWM por software p/ brilho proporcional
            brightness = max(r, g, b) / 255.0
            self._gpio_pwm.ChangeDutyCycle(brightness * 100)

    def _led_worker(self):
        state_start = time.time()
        last_state = None

        while self._running:
            state = self.current_state
            if state != last_state:
                state_start = time.time()  # fase reinicia a cada troca de estado
                last_state = state

            if state == 'IDLE':
                self._set_all_pixels(0, 0, 0)
                time.sleep(0.1)
                continue

            if state == 'ERROR':
                # Urgência — pisca, não respira
                elapsed = time.time() - state_start
                on = int(elapsed * ERROR_BLINK_HZ * 2) % 2 == 0
                r, g, b = COLORS['ERROR'] if on else (0, 0, 0)
                self._set_all_pixels(r, g, b)
                time.sleep(0.02)
                continue

            # Respiração suave: easing cosseno + curva de "demora" nos extremos
            r, g, b = COLORS.get(state, COLORS['IDLE'])
            elapsed = time.time() - state_start
            phase = (elapsed % PULSE_PERIOD_SEC) / PULSE_PERIOD_SEC
            eased = 0.5 - 0.5 * math.cos(2 * math.pi * phase)   # 0..1, suave nas bordas
            shaped = eased ** PULSE_SHAPE                        # lingers no fundo e no topo
            factor = PULSE_MIN_FACTOR + (PULSE_MAX_FACTOR - PULSE_MIN_FACTOR) * shaped

            self._set_all_pixels(int(r * factor), int(g * factor), int(b * factor))
            time.sleep(0.02)  # ~50Hz — movimento sem serrilhado

    def set_state(self, state):
        self.current_state = state

        state_labels = {
            'IDLE': 'Idle',
            'LISTENING': 'Listening',
            'THINKING': 'Thinking',
            'SPEAKING': 'Speaking',
            'PROVISIONING': 'Wi-Fi setup',
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
            if self.use_gpio and self._gpio_pwm:
                self._gpio_pwm.stop()


def create_led_controller():
    """
    Factory — returns LEDController when running on Pi hardware,
    ScreenBorderVisualizer when running on a desktop (no rpi_ws281x / GPIO).
    Falls back to a no-op LEDController if ScreenBorderVisualizer fails.
    """
    if HAS_NEOPIXEL or HAS_GPIO:
        return LEDController()
    try:
        from screen_border import ScreenBorderVisualizer
        return ScreenBorderVisualizer()
    except Exception as e:
        print(f'[LED] Screen border unavailable ({e}) — no visual feedback')
        return LEDController()

