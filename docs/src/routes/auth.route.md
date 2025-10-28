# auth.route.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `auth.route.ts` localizado em `routes`. Este arquivo define o mapeamento de endpoints relacionados à autenticação de usuários, incluindo login e recuperação de senha.

## ⚙️ Fluxo de Funcionamento
Este arquivo mapeia endpoints de autenticação e conecta com controllers correspondentes. É responsável por:
- Mapear endpoint de login (`POST /auth/login`)
- Mapear endpoint de recuperação de senha (`POST /auth/recovery`)
- Aplicar validação de dados com schemas Joi
- Conectar requisições com AuthController
- Usar asyncHandler para tratamento de erros assíncronos

## 🔗 Depende de
**Dependências internas:**
- `../controllers/auth.controller.js` - Controller de autenticação
- `../models/user.model.js` - Schemas de validação (authRecoverySchema, loginSchema)

**Dependências externas:**
- `express` - Framework web para Node.js (Router)
- `express-async-handler` - Middleware para tratamento de erros assíncronos
- `celebrate` - Biblioteca para validação de dados (celebrate, Segments)

## 🧩 Usado por
- `../routes/index.ts` - Arquivo principal de rotas
- Sistema de autenticação
- Clientes da API

## 🗒️ Observações
- Arquivo de rotas especializado em autenticação
- Endpoints públicos (não requerem autenticação)
- Validação obrigatória de dados de entrada
- Uso de asyncHandler para tratamento de erros
- Schemas Joi para validação de email e senha
- Essencial para funcionalidade de login e recuperação
