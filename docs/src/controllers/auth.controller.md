# auth.controller.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `auth.controller.ts` localizado em `controllers`. Este controller gerencia as operações de autenticação, incluindo login e recuperação de senha dos usuários.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas à autenticação e chama o `AuthService` correspondente para processar a lógica de negócio. É responsável por:
- Processar requisições de login (`POST /auth/login`)
- Processar requisições de recuperação de senha (`POST /auth/recovery`)
- Gerar e retornar tokens de autenticação após login bem-sucedido

## 🔗 Depende de
**Dependências internas:**
- `../services/auth.service.js` - Serviço de autenticação para lógica de negócio

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response)

## 🧩 Usado por
- `../routes/auth.route.ts` - Mapeamento das rotas de autenticação
- Middleware de autenticação para validação de tokens

## 🗒️ Observações
- Controller especializado em operações de autenticação
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Retorna tokens JWT após login bem-sucedido
- Implementa tratamento de erros através do middleware de erro
- Requer validação de dados através de schemas Joi
