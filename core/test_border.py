#!/usr/bin/env python3
"""
Quick test harness for ScreenBorderVisualizer.
Run from core/:  python3 test_border.py

Keys:
  1 → IDLE
  2 → LISTENING
  3 → THINKING
  4 → SPEAKING
  5 → ERROR
  q → quit
"""

import sys
import time

sys.path.insert(0, 'src')
from screen_border import ScreenBorderVisualizer

STATES = {
    '1': 'IDLE',
    '2': 'LISTENING',
    '3': 'THINKING',
    '4': 'SPEAKING',
    '5': 'ERROR',
}

def main():
    print('Starting overlay...')
    v = ScreenBorderVisualizer()
    time.sleep(1)

    print('\nBorder test — press a key + Enter:')
    print('  1  IDLE       (purple dim pulse)')
    print('  2  LISTENING  (yellow pulse)')
    print('  3  THINKING   (green breathe)')
    print('  4  SPEAKING   (blue clockwise wave)')
    print('  5  ERROR      (red flash)')
    print('  q  quit\n')

    try:
        while True:
            key = input('state> ').strip().lower()
            if key == 'q':
                break
            if key in STATES:
                state = STATES[key]
                v.set_state(state)
                print(f'→ {state}')
            else:
                print('unknown key — use 1–5 or q')
    except (KeyboardInterrupt, EOFError):
        pass
    finally:
        v.cleanup()
        print('done')

if __name__ == '__main__':
    main()
