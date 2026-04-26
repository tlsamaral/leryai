### Título

**LeryIA: Ecossistema Híbrido de Hardware IoT e Plataforma Mobile para Redução da Ansiedade e Personalização do Aprendizado de Inglês**

---

### Resumo

O presente estudo insere-se na intersecção entre a tecnologia educacional, a Inteligência Artificial Generativa (GenAI) e a Internet das Coisas (IoT), áreas que vêm transformando radicalmente as metodologias de ensino de idiomas. No aprendizado de uma segunda língua, especialmente o inglês, a prática oral frequentemente esbarra em barreiras psicológicas, destacando-se a "ansiedade de fala" (*Foreign Language Speaking Anxiety*). Apesar da proliferação de aplicativos móveis educacionais, a maioria das soluções exige interações baseadas em telas que não simulam adequadamente a naturalidade de uma conversação fluida e, muitas vezes, falham em fornecer um ambiente de baixo julgamento. Diante desse cenário, levanta-se a questão central desta pesquisa: como a integração de um dispositivo IoT sem tela a modelos avançados de linguagem natural pode atuar na redução da ansiedade de fala e promover um aprendizado de inglês altamente personalizado e contínuo? Para responder a esta problemática, o objetivo geral deste trabalho é desenvolver e propor o Lery IA, um ecossistema híbrido composto por um *Smart Speaker* (IoT) e um aplicativo móvel de suporte pedagógico (LMS). Como objetivos específicos, buscam-se: (i) integrar hardware de borda (Raspberry Pi) com APIs de inteligência artificial (Whisper, Gemini) para processamento de linguagem natural em tempo real; (ii) estruturar uma Máquina de Estados (FSM) que garanta fluidez interativa; e (iii) conceber uma lógica de avaliação baseada no Quadro Europeu Comum de Referência (CEFR). O embasamento teórico-pedagógico da pesquisa apoia-se em conceitos consagrados da linguística aplicada e psicologia da educação, notadamente a Hipótese do Filtro Afetivo de Stephen Krashen, o Ensino de Línguas Baseado em Tarefas (TBLT), a Abordagem Comunicativa (CLT) e o conceito de *Scaffolding*. No campo da Inteligência Artificial e computação, a literatura consultada envolve diretrizes de *Prompt Engineering*, sistemas de avaliação automática (AES/ASS) e o *framework* GradeHITL. Metodologicamente, apoiando-se na classificação de pesquisa científica de Bertrand e Fransoo (2002), este estudo caracteriza-se como uma pesquisa Aplicada, de caráter Exploratório e Descritivo, adotando uma abordagem Combinada (Quali-quantitativa). O método principal adotado é o Experimento aliado à Modelagem e Simulação, operacionalizado através da construção do protótipo físico e da modelagem de banco de dados relacional. Como resultados preliminares, espera-se demonstrar a viabilidade técnica da orquestração de áudio e texto com baixa latência, além de validar a eficácia da matriz de rubrica do Lery IA em fornecer *feedbacks* corretivos sutis. Conclui-se que o ecossistema proposto tem o potencial de atuar como um tutor empático, convertendo o erro de um fator de estresse para um motor de engajamento e progressão gamificada no aprendizado de idiomas.

---

### Palavras-chave

LeryIA; Inteligência Artificial Educacional; Smart Speaker IoT; Ansiedade de Fala (Speaking Anxiety); Processamento de Linguagem Natural; Design Pedagógico.

---

### Abstract

This study is situated at the intersection of educational technology, Generative Artificial Intelligence (GenAI), and the Internet of Things (IoT), areas that have been radically transforming language teaching methodologies. In second language learning, especially English, oral practice often encounters psychological barriers, notably "Foreign Language Speaking Anxiety". Despite the proliferation of educational mobile applications, most solutions require screen-based interactions that do not adequately simulate the naturalness of fluid conversation and often fail to provide a low-judgment environment. Given this scenario, the central question of this research arises: how can the integration of a screen-free IoT device with advanced natural language models act in reducing speaking anxiety and promote highly personalized and continuous English learning? To answer this problem, the general objective of this work is to develop and propose Lery IA, a hybrid ecosystem composed of an IoT Smart Speaker and a pedagogical support mobile application (LMS). As specific objectives, it seeks to: (i) integrate edge hardware (Raspberry Pi) with artificial intelligence APIs (Whisper, Gemini, and ElevenLabs) for real-time natural language processing; (ii) structure a Finite State Machine (FSM) that guarantees interactive fluidity; and (iii) design an evaluation logic based on the Common European Framework of Reference (CEFR). The theoretical-pedagogical foundation of the research relies on established concepts from applied linguistics and educational psychology, notably Stephen Krashen's Affective Filter Hypothesis, Task-Based Language Teaching (TBLT), Communicative Language Teaching (CLT), and the concept of Scaffolding. In the field of Artificial Intelligence and computing, the consulted literature involves Prompt Engineering guidelines, Automated Essay/Speech Scoring (AES/ASS) systems, and the GradeHITL framework. Methodologically, relying on the scientific research classification by Bertrand and Fransoo (2002), this study is characterized as Applied research, Exploratory and Descriptive in nature, adopting a Combined (Qualitative-quantitative) approach. The main method adopted is the Experiment combined with Modeling and Simulation, operationalized through the construction of the physical prototype and the modeling of a relational database. As preliminary results, it is expected to demonstrate the technical feasibility of audio and text orchestration with low latency, in addition to validating the effectiveness of the Lery IA rubric matrix in providing subtle corrective feedback. It is concluded that the proposed ecosystem has the potential to act as an empathetic tutor, converting errors from a stress factor into a motor for engagement and gamified progression in language learning.

**Keywords:** LeryIA; Educational Artificial Intelligence; IoT Smart Speaker; Speaking Anxiety; Natural Language Processing; Pedagogical Design.

---

### Referencial Teórico

**1.1 Ambientes de Aprendizado de Baixo Julgamento** A literatura recente destaca que a interação com agentes não humanos reduz o medo da avaliação negativa. A IA atua como um parceiro de treino que não demonstra impaciência, permitindo que o aluno se concentre na produção fonética e sintática sem pressão social.

**1.2 Mobile Learning e Dashboards de Monitoramento** O uso de dispositivos móveis como suporte ao aprendizado (_m-learning_) permite a continuidade do estudo fora do momento da prática oral. Aplicativos de acompanhamento são fundamentais para a "revisão espaçada" e para que o aluno perceba sua evolução através de dados tangíveis.

**1.3 Personalização e Identidade Vocal na IA** A capacidade de ajustar tom, velocidade e modo de fala (ex: sotaques específicos ou níveis de formalidade) permite que o sistema se adapte à necessidade profissional ou acadêmica do usuário, aumentando a relevância do treino.

**1.4 Avaliação Automatizada e Interpretabilidade** A eficácia de um tutor virtual depende da qualidade do seu feedback. A literatura atual aponta que a avaliação baseada em LLMs alcança precisão próxima à humana quando ancorada em rubricas rigorosas e técnicas de raciocínio lógico em cadeia (*Chain-of-Thought*). Em conjunto com mecanismos de *Self-Refining LLMs* (onde a IA refina autonomamente suas próprias diretrizes a partir de falhas relatadas pelo usuário), o sistema garante a interpretabilidade das notas e um diagnóstico altamente escalável e transparente.

---

### Introdução

O desenvolvimento da competência comunicativa em língua inglesa é frequentemente limitado pela "ansiedade de fala" (_Foreign Language Speaking Anxiety_), um estado emocional que gera bloqueios durante a conversação (TNU JOURNAL, 2025) [Link: [https://jst.tnu.edu.vn/jst/article/download/13224/pdf](https://jst.tnu.edu.vn/jst/article/download/13224/pdf)]. Este sentimento de vulnerabilidade e o medo do erro são as principais causas de desistência em métodos tradicionais de ensino (AUSTRALASIAN JOURNAL, 2025) [Link: [https://ajet.org.au/index.php/AJET/article/view/10050](https://ajet.org.au/index.php/AJET/article/view/10050)].

Neste cenário, a Inteligência Artificial tem demonstrado ser uma ferramenta eficaz para mitigar esses efeitos. Pesquisas indicam que alunos que praticam com assistentes de IA apresentam uma melhora de até 28% em sua confiança e fluência oral, justamente por estarem em um ambiente de "risco zero" (JOURNAL 2 UNIVERSITAS PGRI, 2026) [Link: [https://journal2.upgris.ac.id/index.php/eternal/article/view/3208](https://journal2.upgris.ac.id/index.php/eternal/article/view/3208)]. A tecnologia permite que o erro seja encarado como parte do processo técnico, e não como uma falha social.

A proposta do **LeryIA** busca avançar ao unir a interação física via hardware (Raspberry Pi) com a gestão digital via aplicativo mobile. Enquanto o hardware focará na "experiência de presença" e na redução da ansiedade no momento do diálogo (AJET, 2025), o aplicativo mobile fornecerá a camada analítica necessária para o progresso a longo prazo. Através do app, o usuário poderá revisar seus erros e, crucialmente, personalizar a "voz" que o ensina. A capacidade de customizar o tom e o modo de fala da IA é vital, pois a personalização do aprendizado é apontada como o maior fator de engajamento em plataformas de EdTech (DUOLINGO, 2025) [Link: [https://blog.duolingo.com/2025-duolingo-language-report/](https://blog.duolingo.com/2025-duolingo-language-report/)].

Além disso, a estrutura de avaliação da LeryIA adotará diretrizes recentes de interpretabilidade e *Automated Grading*. Em vez de depender de avaliações holísticas e genéricas da IA, o sistema empregará técnicas de *Chain-of-Thought* (CoT) fundamentadas em rubricas (CHU et al., 2025) [Link: [https://arxiv.org/abs/2504.05239](https://arxiv.org/abs/2504.05239)]. Espera-se que essa arquitetura permita que o modelo justifique logicamente a nota a partir de quatro pilares: resolução da tarefa, gramática, vocabulário e fluência. Para garantir escalabilidade técnica sem necessidade de curadoria manual, o ecossistema integrará o conceito de *Self-Refining LLMs*, reescrevendo e ajustando autonomamente suas regras de correção com base nas contestações do próprio aluno via aplicativo. O objetivo é assegurar um feedback corretivo preciso, adaptativo e livre de vieses, fortalecendo a confiança do usuário.

Dessa forma, almeja-se que o LeryIA não se limite a ser um assistente de voz, mas sim um tutor pessoal capaz de se adaptar às nuances psicológicas e técnicas de cada estudante, transformando a prática de inglês em uma atividade acessível, privada, orientada por dados e validada cientificamente.

---

### Referências Bibliográficas

- **AUSTRALASIAN JOURNAL OF EDUCATIONAL TECHNOLOGY.** AI-driven conversational tools and emotional engagement in language learning. 2025. Disponível em: [https://ajet.org.au/index.php/AJET/article/view/10050](https://ajet.org.au/index.php/AJET/article/view/10050)
    
- **CHU, Y. et al.** LLM-based Automated Grading with Human-in-the-Loop. arXiv:2504.05239, 2025. Disponível em: [https://arxiv.org/abs/2504.05239](https://arxiv.org/abs/2504.05239)
    
- **DUOLINGO.** Duolingo Language Report 2025: Global trends in AI-assisted learning. 2025. Disponível em: [https://blog.duolingo.com/2025-duolingo-language-report/](https://blog.duolingo.com/2025-duolingo-language-report/)
    
- **JOURNAL 2 UNIVERSITAS PGRI SEMARANG.** Systematic review of AI feedback in oral fluency development. 2026. Disponível em: [https://journal2.upgris.ac.id/index.php/eternal/article/view/3208](https://journal2.upgris.ac.id/index.php/eternal/article/view/3208)
    
- **TNU JOURNAL OF SCIENCE AND TECHNOLOGY.** Reducing Foreign Language Speaking Anxiety through AI Chatbots. 2025. Disponível em: [https://jst.tnu.edu.vn/jst/article/download/13224/pdf](https://jst.tnu.edu.vn/jst/article/download/13224/pdf)