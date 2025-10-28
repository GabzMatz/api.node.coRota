# user.controller.md

## 📘 Propósito
Descreve o objetivo principal do módulo `user.controller.ts` localizado em `controllers`. Este controller gerencia as operações CRUD relacionadas aos usuários do sistema.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas aos usuários e chama o `UserService` correspondente para processar a lógica de negócio. É responsável por:
- Listar todos os usuários (`GET /users`)
- Buscar usuário por ID (`GET /users/:id`)
- Criar novo usuário (`POST /users`)
- Atualizar usuário existente (`PUT /users/:id`)
- Deletar usuário (`DELETE /users/:id`)

## 🔗 Depende de
**Dependências internas:**
- `../services/user.service.js` - Serviço de usuários para lógica de negócio
- `../models/user.model.js` - Modelo de dados do usuário (User)

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response, NextFunction)

## 🧩 Usado por
- `../routes/user.route.ts` - Mapeamento das rotas de usuários
- Sistema de autenticação
- Sistema de cadastro de usuários

## 🗒️ Observações
- Controller especializado em operações de usuários
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Implementa operações CRUD completas
- Retorna mensagens de sucesso padronizadas
- Requer autenticação para operações sensíveis
- Integra com sistema de autenticação Firebase
