# Handoff – Gerador de Treinos (PWA)

Documento de transição e continuidade entre sessões de desenvolvimento.

---

## 1. Contexto & Decisões Estratégicas Recentes

### A. Abandono do modelo "PC como Servidor"
* A abordagem anterior de rodar um servidor local no PC (`serve .`) e acessar via IP local no iPhone foi definitivamente descartada:
  1. Exigia o PC ligado 24/7.
  2. Falhava em redes Wi-Fi devido a firewall, sleep mode e IP dinâmico.
  3. Não fornecia HTTPS (requisito estrito do iOS Safari para instalação de PWAs e funcionamento estável de Service Workers).
* **Nova Diretriz**: O aplicativo é **100% Client-Side** (estático). Hospedagem na nuvem gratuita (Vercel, GitHub Pages ou Netlify) com CDN global, HTTPS nativo e suporte offline via Service Worker.

### B. Versionamento e Repositório GitHub
* Repositório criado e sincronizado: [lemosalvesjr-alt/treino_academia](https://github.com/lemosalvesjr-alt/treino_academia)
* Visibilidade: Privado. Branch padrão: `main`.

### C. Criação do `AGENTS.md` e Reorganização do Repositório
* `AGENTS.md` criado na raiz do repositório contendo todas as regras, padrões de código e convenções do projeto.
* Remoção de mais de 1.800 arquivos HTML legados do site antigo da RepDB que estavam inflando o repositório.
* Arquivos organizados em pastas dedicadas (`css/`, `js/`, `data/`, `assets/`, `tests/`, `docs/`).

---

## 2. Estrutura Atual do Repositório

```text
treino_academia/
├── AGENTS.md                  # Regras de arquitetura e diretrizes para agentes
├── index.html                 # Ponto de entrada PWA
├── manifest.json              # Manifesto PWA (metadados, tema e ícones)
├── service-worker.js          # Cache e execução offline (na raiz para escopo global /)
├── package.json               # Dependências, scripts (npm test) e metadados
├── .gitignore
│
├── css/
│   └── style.css              # Estilos do app
│
├── js/
│   ├── app.js                 # Inicialização da interface e eventos
│   └── workout.js             # Algoritmo de geração de treinos
│
├── data/
│   └── exercises.json         # Base de exercícios RepDB (2.6 MB, formato JSON)
│
├── assets/
│   ├── icons/                 # Ícones PWA (180px, 32px, SVG)
│   ├── illustrations/         # SVGs (pushup, squat, lunges)
│   └── images/                # Imagens de exercícios (flat, equipment, muscles)
│
├── tests/
│   └── workout.test.js        # Testes automatizados (npm test)
│
└── docs/
    ├── handoff.md             # Este documento
    ├── ATTRIBUTION.md         # Atribuição legal da base RepDB
    ├── LICENSE-CODE
    └── LICENSE-DATA.md
```

---

## 3. Estado Atual e Próximos Passos (Foco da Próxima Sessão)

### Passo 1: Correção Arquitetural do `workout.js` (Crítico)
* **Problema atual**: `js/workout.js` ainda importa `fs` e `path` do Node.js. Isso funciona no `npm test`, mas gera erro no navegador (`Failed to resolve module specifier "fs"`).
* **Solução**: Refatorar `workout.js` e `app.js` para carregar `data/exercises.json` de forma puramente client-side via `fetch('./data/exercises.json')`, mantendo compatibilidade com Node.js para os testes em `tests/workout.test.js` (ou injetando os dados).

### Passo 2: Redesign Completo da Interface (UI/UX Premium)
* A interface atual é básica e crua. Criar uma interface moderna no padrão de aplicativos fitness (Nike Training, Apple Fitness, Freeletics):
  1. **Visual**: Dark mode esportivo de alta energia (fundos escuros, acentos em verde neon/âmbar, tipografia esportiva e cantos arredondados).
  2. **Controles Rápidos**: Chips de duração rápida (10m, 20m, 30m, 45m) e seletor de foco muscular (Corpo Inteiro, Superiores, Core, Inferiores).
  3. **Cards de Exercícios**: Demonstração visual do exercício (`assets/images/flat/...`), músculos ativados, repetições e tempo sugeridos.
  4. **Modo "Treino Ativo" (Player Interativo)**:
     * Botão "Iniciar Treino".
     * Cronômetro de execução na tela para cada exercício.
     * Timer de descanso entre exercícios (com alertas visuais/sonoros).
     * Navegação "Próximo Exercício" e "Concluir Treino".
  5. **Histórico Local**: Salvar treinos concluídos no `localStorage` do dispositivo.

### Passo 3: Publicação em Nuvem Gratuita
* Configurar o deploy gratuito (Vercel ou GitHub Pages) a partir do repositório [lemosalvesjr-alt/treino_academia](https://github.com/lemosalvesjr-alt/treino_academia).
* Gerar a URL pública HTTPS para instalação no iPhone como PWA (Adicionar à Tela de Início).

---

## 4. Comandos de Verificação Rápida
* **Executar testes unitários**: `npm test`
* **Status do Git**: `git status`
* **Sincronizar com GitHub**: `git push origin main`

---
*Atualizado em: 2026-11-05 (Sessão de Organização e Criação do Repositório)*
