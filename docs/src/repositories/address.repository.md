# address.repository.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `address.repository.ts` localizado em `repositories`. Este repository gerencia a persistência e manipulação de dados relacionados aos endereços dos usuários no banco de dados Firestore.

## ⚙️ Fluxo de Funcionamento
Este repository implementa a camada de acesso a dados para endereços e conecta diretamente com o Firestore. É responsável por:
- Listar todos os endereços cadastrados
- Buscar endereço por ID específico
- Criar novos endereços no banco de dados
- Atualizar endereços existentes
- Gerenciar a coleção "address" no Firestore

## 🔗 Depende de
**Dependências internas:**
- `../models/address.model.js` - Modelo de dados do endereço

**Dependências externas:**
- `firebase-admin/firestore` - SDK do Firebase Admin para acesso ao Firestore (CollectionReference, getFirestore)

## 🧩 Usado por
- `../services/address.service.ts` - Service de endereços para operações de negócio
- Sistema de cadastro de usuários
- Sistema de criação de corridas

## 🗒️ Observações
- Repository especializado em operações de endereços
- Implementa operações CRUD básicas para Firestore
- Gerencia automaticamente IDs de documentos
- Retorna null quando documento não existe
- Utiliza coleção "address" no Firestore
- Essencial para persistência de dados de endereços
