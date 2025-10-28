# user.repository.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `user.repository.ts` localizado em `repositories`. Este repository gerencia a persistência e manipulação de dados relacionados aos usuários do sistema no banco de dados Firestore.

## ⚙️ Fluxo de Funcionamento
Este repository implementa a camada de acesso a dados para usuários e conecta diretamente com o Firestore. É responsável por:
- Listar todos os usuários cadastrados
- Buscar usuário por ID específico
- Criar novos usuários no banco de dados
- Atualizar usuários existentes
- Deletar usuários do banco de dados
- Gerenciar a coleção "users" no Firestore

## 🔗 Depende de
**Dependências internas:**
- `../models/user.model.js` - Modelo de dados do usuário

**Dependências externas:**
- `firebase-admin/firestore` - SDK do Firebase Admin para acesso ao Firestore (CollectionReference, getFirestore)

## 🧩 Usado por
- `../services/user.service.ts` - Service de usuários para operações de negócio
- Sistema de autenticação
- Sistema de cadastro de usuários

## 🗒️ Observações
- Repository especializado em operações de usuários
- Implementa operações CRUD completas para Firestore
- Gerencia automaticamente IDs de documentos
- Retorna null quando documento não existe
- Utiliza coleção "users" no Firestore
- Suporta operação de exclusão de usuários
- Essencial para persistência de dados de usuários
