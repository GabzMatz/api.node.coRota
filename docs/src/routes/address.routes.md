# address.routes.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `address.routes.ts` localizado em `routes`. Este arquivo define o mapeamento de endpoints relacionados aos endereços dos usuários, incluindo operações CRUD.

## ⚙️ Fluxo de Funcionamento
Este arquivo mapeia endpoints de endereços e conecta com controllers correspondentes. É responsável por:
- Mapear endpoint de criação (`POST /address/create`)
- Mapear endpoint de listagem (`GET /address`)
- Mapear endpoint de busca por ID (`GET /address/:id`)
- Mapear endpoint de atualização (`PUT /address/:id`)
- Aplicar validação de dados com schemas Joi
- Conectar requisições com AddressController

## 🔗 Depende de
**Dependências internas:**
- `../controllers/address.controller.js` - Controller de endereços
- `../models/address.model.js` - Schema de validação (addressSchema)
- `../models/base.model.js` - Schema de validação (idSchema)

**Dependências externas:**
- `express` - Framework web para Node.js (Router)
- `express-async-handler` - Middleware para tratamento de erros assíncronos
- `celebrate` - Biblioteca para validação de dados (celebrate, Segments)

## 🧩 Usado por
- `../routes/index.ts` - Arquivo principal de rotas
- Sistema de cadastro de usuários
- Sistema de criação de corridas

## 🗒️ Observações
- Arquivo de rotas especializado em endereços
- Endpoint de criação público (não requer autenticação)
- Validação obrigatória de dados de entrada
- Uso de asyncHandler para tratamento de erros
- Schema Joi para validação de dados de endereço
- Essencial para funcionalidade de localização
