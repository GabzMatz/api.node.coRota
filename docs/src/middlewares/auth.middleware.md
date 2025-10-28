# auth.middleware.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `auth.middleware.ts` localizado em `middlewares`. Este middleware gerencia a autenticação e autorização de usuários, verificando tokens JWT e validando acesso às rotas protegidas.

## ⚙️ Fluxo de Funcionamento
Este middleware atua no fluxo de requisição HTTP para validar autenticação. É responsável por:
- Interceptar todas as requisições HTTP
- Verificar se a rota requer autenticação
- Validar token JWT no header Authorization
- Verificar token com Firebase Admin SDK
- Buscar dados do usuário no banco de dados
- Adicionar informações do usuário ao objeto request
- Permitir ou negar acesso baseado na validação

## 🔗 Depende de
**Dependências internas:**
- `../errors/unauthorized.error.js` - Erro customizado para não autorizado
- `../errors/forbidden.error.js` - Erro customizado para acesso negado
- `../services/user.service.js` - Service de usuários para buscar dados

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response, NextFunction)
- `firebase-admin/auth` - SDK do Firebase Admin para verificação de tokens (DecodedIdToken, getAuth)

## 🧩 Usado por
- `../index.ts` - Arquivo principal da aplicação
- Todas as rotas protegidas do sistema
- Sistema de autenticação

## 🗒️ Observações
- Middleware especializado em autenticação JWT
- Rotas públicas: login, recovery, register, search companies, create address
- Valida token Bearer no header Authorization
- Verifica token com Firebase Admin SDK
- Adiciona dados do usuário ao req.user
- Implementa tratamento de erros específicos
- Essencial para segurança da aplicação
