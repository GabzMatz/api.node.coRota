# rides-history.controller.md

## 📘 Propósito
Descreve o objetivo principal do módulo `rides-history.controller.ts` localizado em `controllers`. Este controller gerencia as operações CRUD relacionadas ao histórico de corridas dos usuários.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas ao histórico de corridas e chama o `RidesHistoryService` correspondente para processar a lógica de negócio. É responsável por:
- Listar todo o histórico de corridas (`GET /ride-history`)
- Buscar histórico por ID (`GET /ride-history/:id`)
- Buscar histórico por usuário (`GET /ride-history/user/:id`)

## 🔗 Depende de
**Dependências internas:**
- `../services/rides-history.service.js` - Serviço de histórico de corridas para lógica de negócio

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response)

## 🧩 Usado por
- `../routes/rides-history.routes.ts` - Mapeamento das rotas de histórico de corridas
- Sistema de relatórios de corridas
- Sistema de análise de uso

## 🗒️ Observações
- Controller especializado em operações de histórico de corridas
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Apenas operações de consulta (GET) estão expostas nas rotas
- Funcionalidade específica para buscar histórico por usuário
- Retorna dados do histórico de corridas
