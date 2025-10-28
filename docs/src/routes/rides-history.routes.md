# rides-history.routes.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `rides-history.routes.ts` localizado em `routes`. Este arquivo define o mapeamento de endpoints relacionados ao histórico de corridas dos usuários, incluindo operações de consulta.

## ⚙️ Fluxo de Funcionamento
Este arquivo mapeia endpoints de histórico de corridas e conecta com controllers correspondentes. É responsável por:
- Mapear endpoint de listagem (`GET /ride-history`)
- Mapear endpoint de busca por ID (`GET /ride-history/:id`)
- Mapear endpoint de busca por usuário (`GET /ride-history/user/:id`)
- Aplicar validação de parâmetros com schemas Joi
- Conectar requisições com RidesHistoryController

## 🔗 Depende de
**Dependências internas:**
- `../controllers/rides-history.controller.js` - Controller de histórico
- `../models/base.model.js` - Schema de validação (idSchema)

**Dependências externas:**
- `express` - Framework web para Node.js (Router)
- `express-async-handler` - Middleware para tratamento de erros assíncronos
- `celebrate` - Biblioteca para validação de dados (celebrate, Segments)

## 🧩 Usado por
- `../routes/index.ts` - Arquivo principal de rotas
- Sistema de relatórios de corridas
- Sistema de análise de uso

## 🗒️ Observações
- Arquivo de rotas especializado em histórico de corridas
- Apenas operações de consulta (GET)
- Validação obrigatória de parâmetros de ID
- Uso de asyncHandler para tratamento de erros
- Funcionalidade específica para buscar histórico por usuário
- Essencial para relatórios e auditoria
