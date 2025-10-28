# base.error.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `base.error.ts` localizado em `errors`. Este arquivo define a classe base para todos os erros customizados da aplicação, fornecendo estrutura comum e método para envio de respostas HTTP.

## ⚙️ Fluxo de Funcionamento
Este arquivo define a classe base ErrorBase que é estendida por todos os outros erros customizados. É responsável por:
- Definir estrutura comum para todos os erros
- Armazenar código de status HTTP e mensagem
- Implementar método send() para envio de resposta padronizada
- Prover base para tratamento consistente de erros

## 🔗 Depende de
**Dependências internas:**
- Nenhuma dependência interna específica

**Dependências externas:**
- `express` - Framework web para Node.js (Response)

## 🧩 Usado por
- Todos os outros erros customizados (EmailAlreadyExists, ForbiddenError, etc.)
- `../middlewares/error-handler.middleware.ts` - Middleware de tratamento de erros
- Sistema de tratamento de erros da aplicação

## 🗒️ Observações
- Classe base para todos os erros customizados
- Define código de status HTTP e mensagem de erro
- Implementa método send() para resposta padronizada
- Garante consistência no tratamento de erros
- Essencial para estrutura de erros da aplicação
