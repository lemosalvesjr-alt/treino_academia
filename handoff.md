# Handoff – Gerador de Treinos PWA

## Projeto
- **Nome:** Gerador de Treinos (PWA)
- **Objetivo:** Gerar treinos de exercícios de peso corporal usando a base RepDB e disponibilizar como Progressive Web App que pode ser adicionada ao Home Screen do iPhone.

## Estrutura de Diretórios
```
treino_academia/
├─ index.html               # página principal
├─ style.css                # estilos da UI
├─ manifest.json            # metadados PWA
├─ service-worker.js        # cache offline + pré‑cache da RepDB
├─ app.js                   # lógica de inicialização
├─ workout.js               # gerador de treinos (ES module)
├─ test.js                  # testes unitários (npm test)
├─ repdb-files.js           # lista de todos os arquivos da RepDB para precaching
├─ repdb/                   # clone da RepDB (exercises.json + imagens)
│   └─ images/...          # assets de imagem (.webp, .svg)
└─ README.md                # instruções de instalação e uso
```

## Como Executar
1. **Instale dependências (se ainda não fez):**
   ```
   npm install -g serve   # ou outro servidor estático
   ```
2. **Inicie o servidor local:**
   ```
   serve .
   ```
   O app ficará disponível em `http://<IP>:3000` (ou porta indicada).
3. **Abra no iPhone:**
   - Conecte o iPhone à mesma rede Wi‑Fi.
   - No Safari, digite o endereço acima.
   - Toque em **Compartilhar → Adicionar à Tela de Início**.
4. **Limpar cache antigo (se já testou antes):**
   - iPhone → **Ajustes → Safari → Avançado → Dados de sites** → remover o domínio usado.
   - Reabra o site para que o Service Worker registre novamente.

## Próximos passos recomendados
- **Teste de imagens:** Verificar no console do Safari se há alguma requisição 404. Caso falte algum arquivo, adicione‑o ao `repdb-files.js`.
- **Customização de treinos:** Editar `workout.js` para mudar critérios de seleção (nível, número de exercícios, etc.).
- **Publicação opcional:** Se quiser disponibilizar fora da rede local, basta hospedar os mesmos arquivos num serviço estático (Netlify, Vercel, Firebase Hosting), mantendo `repdb-files.js` atualizado.

## Observações
- Todos os arquivos estão versionados localmente; não há dependências externas nem chaves de API.
- A licença da RepDB exige atribuição – o conteúdo de `ATTRIBUTION.md` já está incluído no projeto.

---
*Gerado em: 2026‑11‑03 20:12 (horário local)*
