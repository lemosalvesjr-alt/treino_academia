# AGENTS.md - Diretrizes do Projeto Treino Academia (PWA)

Este arquivo define as diretrizes, arquitetura e convenções para agentes e desenvolvedores trabalhando neste projeto.

---

## 1. Visão Geral do Projeto
* **Nome**: Gerador de Treinos (PWA)
* **Objetivo**: Aplicativo web progressivo (PWA) voltado para iPhone/mobile para geração e acompanhamento de treinos com exercícios de peso corporal.
* **Dados**: Base RepDB (Creative Commons / licença aberta) com exercícios e ilustrações anatômicas.
* **Modelo Operacional**: 100% Client-Side (estático), sem backend ou necessidade de servidor local do usuário. Suporte completo offline via Service Worker.

---

## 2. Estrutura de Diretórios
O repositório segue rigorosamente a seguinte estrutura:

```text
treino_academia/
├── AGENTS.md                # Diretrizes e regras do projeto para agentes
├── index.html               # Ponto de entrada web (raiz para suporte direto a GitHub Pages)
├── manifest.json            # Manifesto PWA
├── service-worker.js        # Cache offline (permanece na raiz para escopo global /)
├── package.json             # Scripts de teste e metadados
├── README.md                # Guia do projeto e instruções
├── .gitignore
├── css/                     # Estilos (style.css, design system mobile-first)
├── js/                      # Scripts e lógica modular (app.js, workout.js, timer.js)
├── data/                    # Base de dados (exercises.json)
├── assets/                  # Recursos de mídia
│   ├── icons/               # Ícones PWA (192, 512, apple-touch-icon)
│   ├── illustrations/       # SVGs locais
│   └── exercises/           # Imagens de exercícios (flat, equipment, muscles)
├── tests/                   # Testes unitários (workout.test.js)
└── docs/                    # Documentação e histórico (handoff.md, ATTRIBUTION.md)
```

---

## 3. Diretrizes Técnicas e de Arquitetura

### A. Execução 100% no Navegador
* **Proibido usar módulos Node.js (`fs`, `path`, etc.)** no código carregado pelo navegador.
* Carregamento de dados (`data/exercises.json`) deve ser feito via `fetch()` assíncrono com cache em memória e fallback para offline via Service Worker.
* O código deve rodar diretamente no Safari Mobile (iOS) e navegadores modernos sem necessidade de bundlers obrigatórios.

### B. Progressive Web App (PWA) e iOS
* `service-worker.js` deve residir na raiz `/` para ter escopo total sobre os recursos.
* Deve incluir metadados compatíveis com iOS Safari:
  * `<meta name="apple-mobile-web-app-capable" content="yes">`
  * `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
  * `<link rel="apple-touch-icon" ...>`

### C. Padrões de Interface (UI/UX)
* **Mobile-First**: Design pensado prioritariamente para uso em smartphones com uma mão.
* **Dark Mode de Alta Energia**: Fundo escuro esportivo (#121212 / #1e1e1e) com contrastes vivos (verde neon, âmbar, ciano).
* **Feedback Tátil & Visual**: Botões com área de toque mínima de 44x44px, transições suaves, estados de foco e carregamento claros.
* **Modo Treino Ativo**: Interface com cronômetro de exercício, contagem de repetições e timer de descanso entre séries.

---

## 4. Testes e Qualidade
* Testes unitários de lógica de treino devem residir em `tests/workout.test.js`.
* Executar testes com: `npm test`.
* Manter sempre a integridade dos dados e atribuição legal em `docs/ATTRIBUTION.md`.
