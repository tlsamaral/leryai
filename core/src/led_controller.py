class LEDController:
    def __init__(self):
        self.is_embedded = False  # Set to True only on Orange Pi
        # Future GPIO initialization would go here

    def set_state(self, state):
        """
        Updates the LED status based on the system state.
        States: IDLE, LISTENING, THINKING, SPEAKING
        """
        color = "UNKNOWN"
        action = "Waiting"

        if state == "IDLE":
            color = "OFF"
            action = "Idle"
        elif state == "LISTENING":
            color = "BLUE"
            action = "Listening"
        elif state == "THINKING":
            color = "YELLOW"
            action = "Thinking"
        elif state == "SPEAKING":
            color = "GREEN"
            action = "Speaking"

        self._update_led(color, action)

    def _update_led(self, color, action):
        if self.is_embedded:
            # TODO: Implement GPIO control for Orange Pi
            pass
        else:
            # PC Debug Mode
            print(f"[LED: {color} - {action}]")
