try:
    from rpi_ws281x import PixelStrip, Color
    HAS_NEOPIXEL = True
except ImportError:
    HAS_NEOPIXEL = False
    # Fallback dummy function para não dar NameError no PC
    def Color(r, g, b): return (r << 16) | (g << 8) | b
    
    try:
        import RPi.GPIO as GPIO
        HAS_GPIO = True
    except ImportError:
        HAS_GPIO = False

# LED ring configuration:
LED_COUNT      = 12      # Number of LED pixels. Adjust based on your ring
LED_PIN        = 18      # GPIO pin connected to the pixels (18 uses PWM!).
LED_FREQ_HZ    = 800000  # LED signal frequency in hertz (usually 800khz)
LED_DMA        = 10      # DMA channel to use for generating signal (try 10)
LED_BRIGHTNESS = 255     # Set to 0 for darkest and 255 for brightest
LED_INVERT     = False   # True to invert the signal (when using NPN transistor level shift)
LED_CHANNEL    = 0       # set to '1' for GPIOs 13, 19, 41, 45 or 53

class LEDController:
    def __init__(self):
        self.is_embedded = HAS_NEOPIXEL or HAS_GPIO
        self.strip = None

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
            # Fallback for simple RPi.GPIO HIGH/LOW
            GPIO.setmode(GPIO.BCM)
            GPIO.setup(LED_PIN, GPIO.OUT)
            GPIO.output(LED_PIN, GPIO.LOW)

    def set_state(self, state):
        """
        Updates the LED status based on the system state.
        States: IDLE, LISTENING, THINKING, SPEAKING
        """
        color_name = "UNKNOWN"
        action = "Waiting"
        # Color(r, g, b) - wait, WS2812 is usually GRB, but rpi_ws281x Color handles it usually as Color(R, G, B)
        color_val = None

        if state == "IDLE":
            color_name = "OFF"
            color_val = Color(0, 0, 0)
            action = "Idle"
        elif state == "LISTENING":
            color_name = "BLUE"
            color_val = Color(0, 0, 255)
            action = "Listening"
        elif state == "THINKING":
            color_name = "YELLOW"
            color_val = Color(255, 255, 0)
            action = "Thinking"
        elif state == "SPEAKING":
            color_name = "GREEN"
            color_val = Color(0, 255, 0)
            action = "Speaking"

        self._update_led(color_name, color_val, action)

    def _update_led(self, color_name, color_val, action):
        if self.is_embedded:
            if HAS_NEOPIXEL and self.strip:
                for i in range(self.strip.numPixels()):
                    self.strip.setPixelColor(i, color_val)
                self.strip.show()
            elif HAS_GPIO:
                if color_name == "OFF":
                    GPIO.output(LED_PIN, GPIO.LOW)
                else:
                    GPIO.output(LED_PIN, GPIO.HIGH)
                    
        # Debug Mode logging
        print(f"[LED: {color_name} - {action}]")
