> 🧠 **Voltar para o MOC Principal:** [[Lery AI Brain]]

# PROPOSTA DE TCC: SMART SPEAKER PARA ENSINO DE INGLÊS (IA EMBARCADA)

## 1. IDENTIFICAÇÃO DO PROJETO
* **Autor:** Talles Amaral
* **Curso:** Engenharia de Computação
* **Área de Foco:** Sistemas Embarcados, Inteligência Artificial, IHC (Interação Humano-Computador).

---

## 2. RESUMO EXECUTIVO
Desenvolvimento de um dispositivo físico autônomo, baseado na plataforma Raspberry Pi, que atua como tutor de conversação em língua inglesa. O dispositivo utiliza um ciclo de processamento de voz em nuvem para permitir diálogos naturais, correções gramaticais e suporte pedagógico, eliminando a necessidade de telas e reduzindo distrações.

---

## 3. ESPECIFICAÇÕES TÉCNICAS (HARDWARE)

O protótipo será construído seguindo uma arquitetura de "Smart Speaker" integrada:

* **Processamento:** Raspberry Pi 4 Model B ou Raspberry Pi Zero 2 W.
* **Módulo de Áudio:** ReSpeaker 2-Mics Pi HAT (Dual microphone, I2S DAC).
* **Indicadores Visuais:** 3x LEDs RGB APA102 (integrados ao HAT) para feedback de status.
* **Saída Sonora:** Alto-falante mono 8Ω 2W conectado via JST2.0.
* **Entrada de Dados:** Detecção de Voz de Campo Distante (Far-field voice capture).

---

## 4. ARQUITETURA DE SOFTWARE E FLUXO DE DADOS

O sistema operará sob uma **Máquina de Estados Finita (FSM)**:

1.  **ESTADO: IDLE** -> Aguardando detecção local de *Wake Word* ("Hey Teacher") via biblioteca **Porcupine**.
2.  **ESTADO: LISTENING** -> Captura de áudio e upload para API **OpenAI Whisper** (Speech-to-Text).
3.  **ESTADO: THINKING** -> Processamento do texto pela API **Google Gemini**, utilizando *System Prompt* para agir como professor de inglês.
4.  **ESTADO: SPEAKING** -> Conversão da resposta em áudio via API **ElevenLabs** (Text-to-Speech) e reprodução local.



---

## 5. LISTA DE COMPONENTES (BOM - BILL OF MATERIALS)

| Item | Componente | Função |
| :--- | :--- | :--- |
| 01 | Raspberry Pi 4 / Zero 2 W / Orange Pi | Unidade de processamento central |
| 02 | ReSpeaker 2-Mics Pi HAT | Placa de som com microfones e LEDs inclusos |
| 03 | Cartão MicroSD 32GB Classe 10 | Armazenamento do SO e código Python |
| 04 | Alto-falante Interno 8Ω | Saída de voz da IA |
| 05 | Fonte 5V 3A | Alimentação estável do sistema |
| 06 | Case/Gabinete | Proteção física e acústica dos componentes |

---

## 6. DIFERENCIAIS DE ENGENHARIA (VALOR ACADÊMICO)

* **Otimização de Latência:** Implementação de técnicas de buffer e processamento assíncrono para garantir fluidez na conversa.
* **Integração de Periféricos:** Uso de protocolos I2C, SPI e I2S para comunicação entre sensores, atuadores e processador.
* **Processamento na Borda vs Nuvem:** Balanço entre detecção local de palavras-chave e processamento pesado em cloud.

---

## 7. COMANDOS DE CONFIGURAÇÃO RÁPIDA

```bash
# Instalação dos Drivers de Áudio
git clone [https://github.com/respeaker/seeed-voicecard.git](https://github.com/respeaker/seeed-voicecard.git)
cd seeed-voicecard
sudo ./install.sh

# Instalação das Dependências Python
pip install google-generativeai pvporcupine pyaudio