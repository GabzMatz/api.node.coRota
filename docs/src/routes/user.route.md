# user.route.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `user.route.ts` localizado em `routes`. Este arquivo define o mapeamento de endpoints relacionados aos usuários do sistema, incluindo operações CRUD.

## ⚙️ Fluxo de Funcionamento
Este arquivo mapeia endpoints de usuários e conecta com controllers correspondentes. É responsável por:
- Mapear endpoint de listagem (`GET /users`)
- Mapear endpoint de busca por ID (`GET /users/:id`)
- Mapear endpoint de registro (`POST /users/register`)
- Mapear endpoint de atualização (`PUT /users/:id`)
- Mapear endpoint de exclusão (`DELETE /users/:id`)
- Aplicar validação de dados com schemas Joi
- Conectar requisições com UsersController

## 🔗 Depende de
**Dependências internas:**
- `../controllers/user.controller.js` - Controller de usuários
- `../models/user.model.js` - Schemas de validação (createUserSchema, updateUserSchema)
- `../models/base.model.js` - Schema de validação (idSchema)

**Dependências externas:**
- `express` - Framework web para Node.js (Router)
- `express-async-handler` - Middleware para tratamento de erros assíncronos
- `celebrate` - Biblioteca para validação de dados (celebrate, Segments)

## 🧩 Usado por
- `../routes/index.ts` - Arquivo principal de rotas
- Sistema de autenticação
- Sistema de cadastro de usuários

## 🗒️ Observações
- Arquivo de rotas especializado em usuários
- Endpoint de registro público (não requer autenticação)
- Validação obrigatória de dados de entrada
- Uso de asyncHandler para tratamento de erros
- Schemas Joi separados para criação e atualização
- Implementa operações CRUD completas
- Essencial para funcionalidade de usuários
