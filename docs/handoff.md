# Handoff – Gerador de Treinos (PWA)

Documento de transição e continuidade entre sessões de desenvolvimento.

---

## 1. Contexto & Decisões Estratégicas

### A. Modelo Operacional
* O aplicativo é **100% Client-Side** (estático). Não requer servidor ou backend.
* Suporte completo offline via Service Worker v3 com cache automático de recursos e imagens sob demanda.
* Hospedagem gratuita no GitHub Pages com HTTPS nativo para instalação no iOS Safari.

### B. Versionamento e Repositório GitHub
* Repositório: [lemosalvesjr-alt/treino_academia](https://github.com/lemosalvesjr-alt/treino_academia)
* Branch padrão: `main`
* **Release Oficial**: [v1.0.1](https://github.com/lemosalvesjr-alt/treino_academia/releases/tag/v1.0.1) (anterior: v1.0.0)

---

## 2. Estrutura Atual do Repositório

```text
treino_academia/
├── AGENTS.md                  # Regras de arquitetura e diretrizes para agentes
├── README.md                  # Descrição do projeto e atribuição legal RepDB
├── index.html                 # Ponto de entrada PWA (Dark theme esportivo + views reativas)
├── manifest.json              # Manifesto PWA com tema escuro e ícones
├── service-worker.js          # Cache offline v3 com suporte sob demanda para imagens
├── package.json               # Dependências, scripts (npm test) e metadados
├── .gitignore
│
├── css/
│   └── style.css              # Design System mobile-first, dark mode alta energia, safe-areas iOS
│
├── js/
│   ├── app.js                 # Inicialização da interface, views, player de treino e histórico
│   ├── workout.js             # Algoritmo puro de geração de treinos (sem dependências de Node)
│   └── timer.js               # Controlador de countdown timer (exercício / descanso / pausa)
│
├── data/
│   └── exercises.json         # Base de exercícios RepDB (2.6 MB, formato JSON)
│
├── assets/
│   ├── icons/                 # Ícones PWA (180px, 32px, SVG)
│   ├── illustrations/         # SVGs locais de fallback
│   └── images/                # Imagens de exercícios (flat, equipment, muscles)
│
├── tests/
│   └── workout.test.js        # Testes automatizados (37 testes passando via npm test)
│
└── docs/
    ├── handoff.md             # Este documento
    ├── ATTRIBUTION.md         # Atribuição legal da base RepDB
    ├── LICENSE-CODE
    └── LICENSE-DATA.md
```

---

## 3. Marcos Alcançados (v1.0.0)

1. **Release Oficial `v1.0.0`**: Tag anotada e Release criada no GitHub com changelog completo.
2. **Arquitetura 100% Browser-Safe**: Módulo `workout.js` sem chamadas de Node (`fs`/`path`), testado via Node com dados injetados e consumido via `fetch()` no navegador.
3. **Filtros Completos de Treino**: Duração (10, 20, 30, 45 min), Nível (Iniciante, Intermediário, Avançado) e Foco Muscular (Corpo Inteiro, Superiores, Core, Inferiores).
4. **Player de Treino Interativo**: Cronômetro circular animado, alternância automática de séries e descansos proporcionais ao nível.
5. **Histórico Local Persistente**: Treinos concluídos salvos no `localStorage`.
6. **Suíte de Testes Unitários**: 37 testes automatizados cobrindo geração, limites e validações.
7. **Atribuição Legal RepDB**: Licença livre e atribuição presente no README e no rodapé do aplicativo.

---

## 4. Próximo Passo do Usuário

* Tornar o repositório público em [Settings > Danger Zone](https://github.com/lemosalvesjr-alt/treino_academia/settings) para ativar o **GitHub Pages** gratuitamente na branch `main`.
