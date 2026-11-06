# Handoff – Gerador de Treinos (PWA)

Documento de transição e continuidade entre sessões de desenvolvimento.

---

## 1. Contexto & Decisões Estratégicas Recentes

### A. Abandono do modelo "PC como Servidor"
* A abordagem de rodar um servidor local no PC (`serve .`) e acessar via IP local no iPhone foi descartada:
  1. Exigia o PC ligado 24/7.
  2. Falhava em redes Wi-Fi devido a firewall, sleep mode e IP dinâmico.
  3. Não fornecia HTTPS (requisito estrito do iOS Safari para instalação de PWAs e funcionamento estável de Service Workers).
* **Diretriz**: O aplicativo é **100% Client-Side** (estático). Hospedagem na nuvem gratuita (GitHub Pages / Vercel) com CDN global, HTTPS nativo e suporte offline via Service Worker.

### B. Versionamento e Repositório GitHub
* Repositório: [lemosalvesjr-alt/treino_academia](https://github.com/lemosalvesjr-alt/treino_academia)
* Branch de trabalho atual: `refactor/workout-load`
* Branch padrão de produção: `main`

---

## 2. Estrutura Atual do Repositório

```text
treino_academia/
├── AGENTS.md                  # Regras de arquitetura e diretrizes para agentes
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

## 3. Estado Atual e Conquistas Recentes

### ✅ Passo 1: Correção Arquitetural do `workout.js` (Concluído)
- **Zero módulos Node.js no frontend**: Removidos imports de `fs` e `path`. O módulo `workout.js` é agora uma função pura que recebe os dados injetados via `generateWorkout(allExercises, durationMinutes, level, focus)`.
- **Compatibilidade total com Browser e Node.js**: O `app.js` carrega `exercises.json` via `fetch('./data/exercises.json')`, enquanto `tests/workout.test.js` carrega via `fs.readFileSync`.
- **Filtro de Foco Muscular**: Suporte completo para `corpo-inteiro`, `superiores`, `core` e `inferiores` (incluindo exercícios de `full_body` em todos os focos).
- **Tratamento de Campos**: Resolução dinâmica de imagens (`main` → `start` → `peak` → fallback SVG), contagem de repetições baseada no MET e tempo de descanso escalonado por nível (15s iniciante, 12s intermediário, 10s avançado).
- **Testes Unitários**: 37 testes automatizados cobrindo todos os cenários válidos, filtragem, campos de retorno, rest intervals, tratamentos de erro e resoluções de imagem.

### ✅ Passo 2: Redesign Completo da Interface UI/UX (Concluído)
- **Dark Mode Esportivo**: Fundo `#0a0a0a` / `#1a1a1a` com contrastes em verde neon (`#00e676`), âmbar (`#ffa726`) e ciano (`#00e5ff`).
- **Controles Rápidos por Chips**: Duração (10m, 20m, 30m, 45m), Nível (Iniciante, Intermediário, Avançado) e Foco Muscular (Corpo Inteiro, Superiores, Core, Inferiores) com feedback tátil e área de toque > 44px.
- **Card de Exercícios Preview**: Exibição da imagem webp do exercício, badges de músculos ativados, reps e tempo estimado.
- **Modo Treino Ativo (Player Interativo)**:
  - Barra de progresso do treino.
  - Timer circular com animação SVG (verde para exercício, âmbar para descanso).
  - Alterne automático: término do exercício inicia descanso; término do descanso avança para o próximo.
  - Controles de Play/Pause, Anterior, Próximo e Encerrar Treino.
- **Tela de Conclusão**: Resumo de tempo total, exercícios realizados, foco e nível com animação de celebração.
- **Histórico Local Persistente**: Armazenamento dos treinos concluídos em `localStorage` com listagem e opção de limpeza.
- **Barra de Navegação Inferior**: Acesso rápido entre Treino e Histórico, adaptada para Safe Area do iPhone.

---

## 4. Próximos Passos (Passo 3: Deploy & Publicação)

1. **Commit e Push das alterações**:
   - Commitar os arquivos modificados e o novo `js/timer.js` no branch `refactor/workout-load`.
   - Realizar merge ou push para a branch `main`.
2. **Publicação no GitHub Pages**:
   - Configurar o GitHub Pages para servir a raiz (`/`) da branch `main`.
3. **Instalação no iPhone**:
   - Acessar a URL HTTPS gerada no Safari do iPhone.
   - Tocar em "Compartilhar" -> "Adicionar à Tela de Início".
   - Testar o funcionamento offline (modo avião).

---

## 5. Comandos de Verificação Rápida
* **Executar testes unitários**: `npm test`
* **Status do Git**: `git status`
