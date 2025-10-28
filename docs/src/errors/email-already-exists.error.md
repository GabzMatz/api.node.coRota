# email-already-exists.error.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `email-already-exists.error.ts` localizado em `errors`. Este arquivo define um erro customizado específico para quando um email já está vinculado a uma conta existente.

## ⚙️ Fluxo de Funcionamento
Este arquivo define a classe EmailAlreadyExists que estende ErrorBase. É responsável por:
- Representar erro quando email já existe no sistema
- Retornar código de status HTTP 409 (Conflict)
- Prover mensagem padrão sobre email duplicado
- Permitir mensagem customizada quando necessário

## 🔗 Depende de
**Dependências internas:**
- `./base.error.js` - Classe base para erros customizados (ErrorBase)

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../services/auth.service.ts` - Service de autenticação para criação de usuários
- Sistema de cadastro de usuários
- Validação de emails duplicados

## 🗒️ Observações
- Erro customizado para emails duplicados
- Código de status HTTP 409 (Conflict)
- Mensagem padrão: "O e-mail informado já está vinculado a uma conta!"
- Permite mensagem customizada no construtor
- Lançado quando Firebase retorna erro auth/email-already-exists
