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
* **Release Oficial**: [v1.1.0](https://github.com/lemosalvesjr-alt/treino_academia/releases/tag/v1.1.0) (anteriores: v1.0.1, v1.0.0)

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

## 3. Marcos Alcançados (v1.1.0)

1. **Correção Biomecânica da Composição de Séries**:
   * Fim do sorteio aleatório infinito de dezenas de exercícios para uma única série.
   * Introdução de **Séries Estruturadas (2 a 4 séries por exercício)** com repetição motora progressiva.
   * Seleção realista de **4 a 8 exercícios principais**, com alternância equilibrada de grupos musculares.
   * **Descansos Realistas e Seguros**: Iniciante (45s), Intermediário (30s), Avançado (20s).
   * O Player Ativo agora gerencia a execução série a série (`Exercício 1 de 6 • Série 1/3`).
2. **Release Oficial `v1.1.0`**: Tag anotada e Release criada no GitHub.
3. **Service Worker v5**: Cache atualizado com pré-cache de todas as 216 ilustrações e scripts sincronizados.
4. **Suíte de Testes Unitários**: 40 testes automatizados cobrindo geração, composição de séries, limites e validações.

---

## 4. Próximo Passo do Usuário

* Tornar o repositório público em [Settings > Danger Zone](https://github.com/lemosalvesjr-alt/treino_academia/settings) para ativar o **GitHub Pages** gratuitamente na branch `main`.
