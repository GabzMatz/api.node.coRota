# auth.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `auth.service.ts` localizado em `services`. Este service gerencia toda a lógica de negócio relacionada à autenticação de usuários, incluindo criação, atualização, exclusão, login e recuperação de senha.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para autenticação e conecta com repositories e serviços externos. É responsável por:
- Criar usuários no Firebase Auth
- Atualizar dados de usuários autenticados
- Deletar usuários do sistema
- Processar login com validação de credenciais
- Enviar emails de recuperação de senha
- Gerar links de verificação de email

## 🔗 Depende de
**Dependências internas:**
- `../errors/email-already-exists.error.js` - Erro customizado para email duplicado
- `../errors/unauthorized.error.js` - Erro customizado para credenciais inválidas
- `../models/user.model.js` - Modelo de dados do usuário

**Dependências externas:**
- `firebase-admin/auth` - SDK do Firebase Admin para gerenciamento de usuários
- `firebase/auth` - SDK do Firebase para autenticação do cliente
- `firebase/app` - Core do Firebase

## 🧩 Usado por
- `../controllers/auth.controller.ts` - Controller de autenticação
- `../services/user.service.ts` - Service de usuários para operações de CRUD
- Middleware de autenticação para validação de tokens

## 🗒️ Observações
- Service especializado em operações de autenticação Firebase
- Implementa tratamento de erros específicos do Firebase
- Gerencia tanto operações administrativas quanto de cliente
- Integra com sistema de email para recuperação de senha
- Valida credenciais e gera tokens de autenticação
