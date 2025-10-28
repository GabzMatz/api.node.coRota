# express.d.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `express.d.ts` localizado em `@types`. Este arquivo define extensões de tipos TypeScript para o Express, adicionando propriedades customizadas ao objeto Request.

## ⚙️ Fluxo de Funcionamento
Este arquivo estende a interface Request do Express para incluir dados customizados. É responsável por:
- Declarar namespace global Express
- Estender interface Request com propriedade user
- Definir tipo User para dados do usuário autenticado
- Prover tipagem TypeScript para middleware de autenticação
- Garantir type safety em toda a aplicação

## 🔗 Depende de
**Dependências internas:**
- `../models/user.model` - Modelo de dados do usuário (User)

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../middlewares/auth.middleware.ts` - Middleware de autenticação
- Todos os controllers que acessam req.user
- Sistema de autenticação
- TypeScript compiler para validação de tipos

## 🗒️ Observações
- Arquivo especializado em extensão de tipos TypeScript
- Declaração global para namespace Express
- Adiciona propriedade user ao objeto Request
- Garante type safety para dados de usuário autenticado
- Essencial para funcionamento correto do TypeScript
- Permite acesso tipado a req.user em toda aplicação
