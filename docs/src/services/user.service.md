# user.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `user.service.ts` localizado em `services`. Este service gerencia toda a lógica de negócio relacionada aos usuários do sistema, incluindo operações CRUD e integração com sistema de autenticação.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para usuários e conecta com repositories e serviços de autenticação. É responsável por:
- Listar todos os usuários cadastrados
- Buscar usuário por ID com validação de existência
- Criar novos usuários com integração ao Firebase Auth
- Atualizar dados de usuários existentes
- Deletar usuários do sistema (Firebase Auth + banco de dados)
- Gerenciar timestamps de criação e atualização
- Enviar emails de verificação

## 🔗 Depende de
**Dependências internas:**
- `../errors/not-found.error.js` - Erro customizado para recursos não encontrados
- `../models/user.model.js` - Modelo de dados do usuário
- `../repositories/user.repository.js` - Repository para persistência de dados
- `../services/auth.service.js` - Service de autenticação para operações Firebase

**Dependências externas:**
- Nenhuma dependência externa direta (usa AuthService)

## 🧩 Usado por
- `../controllers/user.controller.ts` - Controller de usuários
- `../middlewares/auth.middleware.ts` - Middleware de autenticação
- Sistema de cadastro de usuários

## 🗒️ Observações
- Service especializado em operações de usuários
- Integra com Firebase Auth para gerenciamento de autenticação
- Validação de existência antes de operações de atualização e exclusão
- Gerencia automaticamente timestamps de criação e atualização
- Envia emails de verificação após criação de usuário
- Mantém sincronização entre Firebase Auth e banco de dados
- Essencial para funcionalidade de autenticação do sistema
