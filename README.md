# Lery AI 🤖

**Lery AI** é um assistente de inteligência artificial interativo projetado para escutar, processar informações e responder de forma inteligente através de voz. Este projeto está sendo construído com uma arquitetura modular, com o objetivo de expandir sua interface para a Web, Mobile e via API.

## 🎯 Propósito do Projeto

O objetivo principal do **Lery AI** é fornecer um "cérebro" de IA ágil e expansível, capaz de interagir de forma natural usando processamento de áudio (STT e TTS) e controle de hardware (LEDs) para representar seu estado atual (como `Ouvindo`, `Pensando` e `Falando`).

A codebase foi estruturada para ser o pilar central de um ecossistema completo de aplicações.

## 📂 Estrutura do Projeto

O projeto foi organizado de forma modular para facilitar o desenvolvimento futuro:

- **`core/`**: É o coração da Inteligência Artificial. Contém toda a lógica principal:
  - Integração com LLMs (`brain_manager`).
  - Captação e reprodução de áudio (`audio_manager`).
  - Reconhecimento de voz (via Whisper).
  - Conversão de Texto para Fala (TTS).
  - Controle de hardware/LEDs (`led_controller`) mostrando os estados: *IDLE*, *LISTENING*, *THINKING* e *SPEAKING*.
- **`api/`** *(Em breve)*: Servirá como a interface de comunicação (Backend/API REST ou GraphQL) para conectar o `core` a outros serviços e clientes.
- **`web/`** *(Em breve)*: Aplicação Frontend (Dashboard / Interface Web) para interagir com a IA pelo navegador.
- **`mobile/`** *(Em breve)*: Aplicativo móvel para levar a experiência do Lery AI para smartphones.

## 🚀 Como Funciona o Core

Atualmente, ao iniciar o `core` (através do `main.py`), a IA entra em um ciclo interativo contínuo:
1. **Ouvir (LISTENING):** Grava o áudio do usuário e transcreve usando OpenAI Whisper.
2. **Pensar (THINKING):** O `brain_manager` processa o texto transcrito e gera uma resposta inteligente.
3. **Falar (SPEAKING):** A resposta é convertida em áudio (com suporte a múltiplos idiomas, como Português e Inglês) e reproduzida para o usuário.
4. **Respirar (IDLE):** Aguarda a próxima interação, com indicação visual através dos LEDs.

## 🛠 Tecnologias Principais (Core)
- **Python** como linguagem principal.
- **OpenAI e Whisper** para geração de texto e transcrição de áudio.
- **gTTS** para conversão de Texto-para-Fala.
- **Dotenv** para gerenciamento de variáveis de ambiente.

---
*Construído para ser mais do que apenas um script, mas um ecossistema completo de IA funcional.*
