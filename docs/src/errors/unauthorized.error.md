# unauthorized.error.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `unauthorized.error.ts` localizado em `errors`. Este arquivo define um erro customizado específico para quando o usuário não está autenticado ou as credenciais são inválidas.

## ⚙️ Fluxo de Funcionamento
Este arquivo define a classe UnauthorizedError que estende ErrorBase. É responsável por:
- Representar erro quando usuário não está autenticado
- Retornar código de status HTTP 401 (Unauthorized)
- Prover mensagem padrão sobre não autorizado
- Permitir mensagem customizada quando necessário

## 🔗 Depende de
**Dependências internas:**
- `./base.error.js` - Classe base para erros customizados (ErrorBase)

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../middlewares/auth.middleware.ts` - Middleware de autenticação
- `../services/auth.service.ts` - Service de autenticação para login
- Sistema de autenticação
- Validação de tokens JWT

## 🗒️ Observações
- Erro customizado para não autorizado
- Código de status HTTP 401 (Unauthorized)
- Mensagem padrão: "Não autorizado!"
- Permite mensagem customizada no construtor
- Lançado quando token é inválido ou credenciais são incorretas
