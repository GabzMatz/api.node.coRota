# internal-server.error.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `internal-server.error.ts` localizado em `errors`. Este arquivo define um erro customizado específico para erros internos do servidor que não foram tratados especificamente.

## ⚙️ Fluxo de Funcionamento
Este arquivo define a classe InternalServerError que estende ErrorBase. É responsável por:
- Representar erros internos não tratados
- Retornar código de status HTTP 500 (Internal Server Error)
- Prover mensagem padrão sobre erro interno
- Permitir mensagem customizada quando necessário

## 🔗 Depende de
**Dependências internas:**
- `./base.error.js` - Classe base para erros customizados (ErrorBase)

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../middlewares/error-handler.middleware.ts` - Middleware de tratamento de erros
- Sistema de tratamento de erros
- Captura de erros não tratados

## 🗒️ Observações
- Erro customizado para erros internos do servidor
- Código de status HTTP 500 (Internal Server Error)
- Mensagem padrão: "Erro interno no servidor!"
- Permite mensagem customizada no construtor
- Usado como fallback para erros não tratados
