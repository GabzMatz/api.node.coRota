# not-found.error.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `not-found.error.ts` localizado em `errors`. Este arquivo define um erro customizado específico para quando um recurso não é encontrado.

## ⚙️ Fluxo de Funcionamento
Este arquivo define a classe NotFoundError que estende ErrorBase. É responsável por:
- Representar erro quando recurso não é encontrado
- Retornar código de status HTTP 404 (Not Found)
- Requerer mensagem customizada obrigatória
- Prover feedback específico sobre recurso não encontrado

## 🔗 Depende de
**Dependências internas:**
- `./base.error.js` - Classe base para erros customizados (ErrorBase)

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../middlewares/page-not-found.middleware.ts` - Middleware de rotas não encontradas
- `../services/address.service.ts` - Service de endereços
- `../services/companies.service.ts` - Service de empresas
- `../services/rides-history.service.ts` - Service de histórico
- `../services/rides.service.ts` - Service de corridas
- `../services/user.service.ts` - Service de usuários
- Sistema de validação de recursos

## 🗒️ Observações
- Erro customizado para recursos não encontrados
- Código de status HTTP 404 (Not Found)
- Requer mensagem customizada obrigatória
- Usado em services para validação de existência
- Usado em middleware para rotas não encontradas
