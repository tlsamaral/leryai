> 🧠 **Voltar para o MOC Principal:** [[Lery AI Brain]]

## 🎯 O Conceito: "Hey Lery"

O nome **Lery** foi concebido para ser o identificador único do assistente, servindo tanto como marca do projeto quanto como a *Wake Word* (palavra de ativação) do sistema.

### 1. Etimologia e Significado
O nome é uma derivação fonética simplificada, focada em soar amigável e acessível. A escolha de "Lery" busca personificar o dispositivo, transformando um hardware frio em um "parceiro de estudos" (Peer-Tutor), reduzindo a barreira psicológica e a ansiedade do estudante ao praticar um novo idioma.

### 2. Justificativa Técnica (Engenharia de Computação)
A escolha da *Wake Word* **"Hey Lery"** baseia-se em critérios de Processamento Digital de Sinais (DSP):

* **Assinatura Fonética:** A combinação de consoantes líquidas (`/l/`) e vibrantes (`/r/`) com a terminação em vogal alta (`/i/`) cria um padrão espectrográfico distinto, facilitando a detecção pelo modelo de *TinyML* (local) e reduzindo falsos positivos.
* **Baixa Latência de Reconhecimento:** Por ser uma palavra curta e com fonemas bem definidos, o motor de detecção (ex: Porcupine/Snowboy) exige menor poder computacional para validar o gatilho.
* **Interação Hands-free:** O bordão permite que o usuário inicie a prática de conversação sem qualquer contato físico com o dispositivo, simulando uma interação humana natural.

### 3. Estados de Ativação Visual
| Gatilho Vocal    | Ação do Sistema              | Feedback LED (ReSpeaker)     |
| :--------------- | :--------------------------- | :--------------------------- |
| *"Hey Lery"*     | Ativação do Engine de Escuta | Pulsar Azul (Cyan)           |
| *Silêncio/Pausa* | Processamento de Intenção    | Rotação de LEDs (Processing) |
| *Resposta da IA* | Execução do TTS | Verde Suave (Speaking) |
---