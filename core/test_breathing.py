#!/usr/bin/env python3
"""
Teste visual dos LEDs e efeito breathing (respiração) no Raspberry Pi.
Executar com permissão de root (necessário para acesso ao hardware SPI/DMA):
    sudo python3 test_breathing.py
"""

import os
import sys
import time

# Adiciona o diretório src ao sys.path para importar o led_controller
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(current_dir, 'src'))

from led_controller import LEDController

STATES = [
    ('LISTENING', 'Amarelo suave (ouvindo voz)'),
    ('THINKING', 'Verde suave (processando)'),
    ('SPEAKING', 'Azul suave (falando)'),
    ('PROVISIONING', 'Ciano suave (configuração Wi-Fi)'),
    ('ERROR', 'Vermelho piscante (alerta)'),
    ('IDLE', 'Apagado'),
]

def main():
    print("=" * 55)
    print(" Lery AI - Teste de Estados e Respiração dos LEDs")
    print("=" * 55)

    controller = LEDController()

    try:
        for state, desc in STATES:
            print(f"\n▶ Testando [{state}]: {desc} por 5 segundos...")
            controller.set_state(state)
            time.sleep(5)

    except KeyboardInterrupt:
        print("\n\nTeste interrompido pelo usuário.")
    finally:
        print("\nDesligando LEDs...")
        controller.cleanup()
        print("Teste concluído!")

if __name__ == '__main__':
    main()
