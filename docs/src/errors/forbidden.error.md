# forbidden.error.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `forbidden.error.ts` localizado em `errors`. Este arquivo define um erro customizado específico para quando o acesso a um recurso é negado (usuário autenticado mas sem permissão).

## ⚙️ Fluxo de Funcionamento
Este arquivo define a classe ForbiddenError que estende ErrorBase. É responsável por:
- Representar erro quando acesso é negado
- Retornar código de status HTTP 403 (Forbidden)
- Prover mensagem padrão sobre acesso negado
- Permitir mensagem customizada quando necessário

## 🔗 Depende de
**Dependências internas:**
- `./base.error.js` - Classe base para erros customizados (ErrorBase)

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../middlewares/auth.middleware.ts` - Middleware de autenticação
- Sistema de autorização
- Validação de permissões de usuário

## 🗒️ Observações
- Erro customizado para acesso negado
- Código de status HTTP 403 (Forbidden)
- Mensagem padrão: "Não autorizado!"
- Permite mensagem customizada no construtor
- Lançado quando usuário autenticado não tem permissão
