> 🧠 **Voltar para o MOC Principal:** [[Lery AI Brain]]

# 📱 Linha do Tempo Lery IA: Build in Public (LinkedIn)

Este documento serve como um histórico e planejamento das postagens no LinkedIn sobre o desenvolvimento do **Lery IA**. 

A estratégia de publicar o TCC enquanto ele é construído (*Build in Public*) tem três objetivos:
1. **Validar a ideia** com profissionais do mercado (professores de inglês, engenheiros de software e especialistas em hardware).
2. **Criar portfólio** e autoridade técnica para a sua carreira.
3. **Receber sugestões** que podem ser incorporadas ou citadas no TCC.

---

## 🚀 Post 1: A Dor e a Proposta (O Teaser)
**Fase do Projeto:** Validação da Ideia e Kickoff do TCC.
**Objetivo:** Gerar engajamento pela identificação com o problema ("travar" ao falar inglês) e apresentar o conceito híbrido.

**Texto do Post:**
Você já estudou inglês por anos, mas na hora de falar com alguém, simplesmente "travou"? 🥶

Isso tem um nome científico: *Foreign Language Speaking Anxiety* (Ansiedade de Fala). O medo de ser julgado bloqueia o nosso cérebro.

Para o meu TCC em Engenharia de Computação, decidi atacar esse problema criando o **Lery IA**: um ecossistema híbrido (Hardware IoT + Mobile) focado 100% em destravar a conversação.

💡 **Como funciona?**
Em vez de um app onde você fica olhando para a tela, estou construindo um *Smart Speaker* físico (com Raspberry Pi) que atua como um tutor sem julgamentos. Você interage com o hardware no seu quarto, no seu tempo. As luzes de LED respondem à sua voz, criando um ambiente relaxante. Depois, todo o seu progresso, correções gramaticais e métricas vão para um App Mobile assíncrono!

Estou desenhando a arquitetura que une IoT de Borda com LLMs (Gemini/Whisper). 

Professores de inglês e devs da minha rede: o que vocês acham dessa abordagem de tirar o aluno da tela do celular na hora de praticar a fala? Faz sentido? 👇

#EngenhariaDeComputação #IoT #InteligenciaArtificial #EdTech #BuildInPublic #TCC #EnglishLearning #RaspberryPi

---

## 🧠 Post 2: O Cérebro Pedagógico (Como não ser só mais um ChatGPT)
**Fase do Projeto:** Definição da Arquitetura de Software e Rubrica.
**Objetivo:** Mostrar profundidade técnica. Provar que não é só "uma chamada de API", mas engenharia de software aplicada à pedagogia.

**Texto do Post:**
Como garantir que uma IA dê uma nota "justa" para o seu nível de inglês e não dependa do humor do algoritmo? 🤔

Na construção do meu TCC (o Lery IA - um tutor físico de idiomas), esbarrei em um grande desafio: Large Language Models (LLMs) são ótimos para conversar, mas péssimos para dar notas matemáticas de forma consistente.

A solução que estou implementando utiliza **Automated Grading com Chain-of-Thought (CoT)**. 
Em background, eu não peço para a IA apenas "avaliar o aluno". O sistema injeta um prompt rigoroso baseado no Quadro Europeu (CEFR) e força o LLM a gerar um JSON com 4 pilares exatos:
1️⃣ Resolução da Tarefa (Pragmática)
2️⃣ Precisão Gramatical
3️⃣ Vocabulário 
4️⃣ Fluência Lógica

Só depois de analisar passo a passo, o sistema compila o Score (0-100) e envia o feedback corretivo para o Dashboard do aluno no celular. Sem alucinações. Sem notas tiradas do nada.

Queria ouvir dos engenheiros de dados e prompts aqui: quais estratégias vocês usam para "ancorar" as respostas estruturadas de LLMs em produção? 

#PromptEngineering #LLM #Gemini #EdTech #SoftwareEngineering #TechEducation

---

## 🤖 Post 3: Quem corrige a IA quando ela erra? (Self-Refining)
**Fase do Projeto:** Arquitetura do Human-in-the-Loop.
**Objetivo:** Chocar positivamente com o conceito de escalabilidade autônoma.

**Texto do Post:**
E se o aluno falar a palavra certa, mas o sotaque brasileiro fizer a Inteligência Artificial entender errado e puni-lo na nota? 🤯

Esse é um dos maiores problemas de ferramentas de voz em EdTech: viés de sotaque e alucinação algorítmica. Para o Lery IA, eu precisava de um sistema que aprendesse com os próprios erros sem que eu (desenvolvedor) tivesse que corrigir log por log manualmente.

A arquitetura que estou adotando no TCC foi inspirada em artigos recentes do MIT/IEEE (como o framework GradeHITL). Nós implementamos um sistema de **Self-Refining LLMs**.

Funciona assim:
1. O aluno vê a correção no app mobile.
2. Se achar injusto (ex: "Fui punido por uma gíria"), ele clica em "Reportar".
3. Isso NÃO vai para uma fila de suporte humano. Isso aciona um agente secundário de IA (Reflector) que atua como juiz.
4. Se o juiz IA concordar com o aluno, ele mesmo reescreve a regra no banco de dados para nunca mais cometer aquele erro com aquele usuário! 🔁

Escalabilidade máxima. O sistema se retroalimenta. 
A autonomia das arquiteturas multi-agentes está mudando o jogo. Alguém aqui já implementou pipelines de Self-Refinement em produção?

#ArtificialIntelligence #MachineLearning #AIArchitecture #Innovation #BuildInPublic

---

## 🛠️ Post 4: O Hardware (Showcase do Protótipo)
**Fase do Projeto:** Montagem física e testes.
**Objetivo:** Mostrar "mão na massa". Vídeos e fotos do Raspberry Pi funcionando.

**Texto do Post:**
Chegou a hora da verdade: tirando o Lery IA do papel! 🛠️⚡

A teoria de unir Inteligência Artificial com ensino de idiomas está pronta, mas o diferencial do meu TCC em Engenharia de Computação é a **tangibilidade**. O objetivo é reduzir a ansiedade do aluno conversando com um objeto físico, longe de telas e distrações.

Para o coração do hardware estou utilizando:
🔌 Raspberry Pi (Cérebro do sistema)
🎙️ ReSpeaker 2-Mics Pi HAT (Para captura de áudio direcional)
💡 LEDs RGB (Para dar o feedback visual de "Estou te ouvindo" ou "Estou processando", aplicando Computação Afetiva).

A latência entre Captura Local -> Nuvem (Whisper/Gemini) -> Resposta (TTS ElevenLabs) é o maior desafio técnico agora. Cada milissegundo conta para a conversa parecer natural!

Aos mestres do Hardware e IoT: alguma dica de ouro para otimizar o buffer de áudio no Raspberry Pi em aplicações de voz em tempo real? 

(No vídeo abaixo, um pequeno spoiler do circuito em montagem! 👇)

#IoT #RaspberryPi #Hardware #EmbeddedSystems #Maker #TCC #LeryIA