# company.routes.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `company.routes.ts` localizado em `routes`. Este arquivo define o mapeamento de endpoints relacionados às empresas cadastradas no sistema, incluindo operações CRUD e busca.

## ⚙️ Fluxo de Funcionamento
Este arquivo mapeia endpoints de empresas e conecta com controllers correspondentes. É responsável por:
- Mapear endpoint de criação (`POST /companies`)
- Mapear endpoint de listagem (`GET /companies`)
- Mapear endpoint de busca (`POST /companies/search`)
- Mapear endpoint de busca por ID (`GET /companies/:id`)
- Mapear endpoint de atualização (`PUT /companies/:id`)
- Mapear endpoint de exclusão (`DELETE /companies/:id`)
- Aplicar validação de dados com schemas Joi

## 🔗 Depende de
**Dependências internas:**
- `../controllers/company.controller.js` - Controller de empresas
- `../models/base.model.js` - Schema de validação (idSchema)
- `../models/company.model.js` - Schemas de validação (companySchema, searchCompanySchema)

**Dependências externas:**
- `express` - Framework web para Node.js (Router)
- `express-async-handler` - Middleware para tratamento de erros assíncronos
- `celebrate` - Biblioteca para validação de dados (celebrate, Segments)

## 🧩 Usado por
- `../routes/index.ts` - Arquivo principal de rotas
- Sistema de cadastro de usuários
- Sistema de busca de empresas

## 🗒️ Observações
- Arquivo de rotas especializado em empresas
- Endpoint de busca público (não requer autenticação)
- Validação obrigatória de dados de entrada
- Uso de asyncHandler para tratamento de erros
- Schemas Joi para validação de dados e busca
- Implementa operações CRUD completas
