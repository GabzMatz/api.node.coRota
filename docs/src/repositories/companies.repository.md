# companies.repository.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `companies.repository.ts` localizado em `repositories`. Este repository gerencia a persistência e manipulação de dados relacionados às empresas cadastradas no banco de dados Firestore.

## ⚙️ Fluxo de Funcionamento
Este repository implementa a camada de acesso a dados para empresas e conecta diretamente com o Firestore. É responsável por:
- Listar todas as empresas cadastradas
- Buscar empresa por ID específico
- Criar novas empresas no banco de dados
- Atualizar empresas existentes
- Deletar empresas do banco de dados
- Gerenciar a coleção "companies" no Firestore

## 🔗 Depende de
**Dependências internas:**
- `../models/company.model.js` - Modelo de dados da empresa

**Dependências externas:**
- `firebase-admin/firestore` - SDK do Firebase Admin para acesso ao Firestore (CollectionReference, getFirestore)

## 🧩 Usado por
- `../services/companies.service.ts` - Service de empresas para operações de negócio
- Sistema de cadastro de usuários
- Sistema de busca de empresas

## 🗒️ Observações
- Repository especializado em operações de empresas
- Implementa operações CRUD completas para Firestore
- Gerencia automaticamente IDs de documentos
- Retorna null quando documento não existe
- Utiliza coleção "companies" no Firestore
- Suporta operação de exclusão de empresas
- Essencial para persistência de dados de empresas
