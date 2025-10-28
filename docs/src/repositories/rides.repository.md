# rides.repository.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `rides.repository.ts` localizado em `repositories`. Este repository gerencia a persistência e manipulação de dados relacionados às corridas no banco de dados Firestore.

## ⚙️ Fluxo de Funcionamento
Este repository implementa a camada de acesso a dados para corridas e conecta diretamente com o Firestore. É responsável por:
- Listar todas as corridas cadastradas
- Buscar corrida por ID específico
- Buscar corridas por usuário (como motorista ou passageiro)
- Criar novas corridas no banco de dados
- Atualizar corridas existentes
- Gerenciar a coleção "rides" no Firestore

## 🔗 Depende de
**Dependências internas:**
- `../models/ride.model.js` - Modelo de dados da corrida

**Dependências externas:**
- `firebase-admin/firestore` - SDK do Firebase Admin para acesso ao Firestore (CollectionReference, getFirestore)

## 🧩 Usado por
- `../services/rides.service.ts` - Service de corridas para operações de negócio
- Sistema de carona compartilhada
- Sistema de sugestão de corridas

## 🗒️ Observações
- Repository especializado em operações de corridas
- Implementa operações CRUD básicas para Firestore
- Gerencia automaticamente IDs de documentos
- Suporta consultas por motorista e passageiros
- Implementa lógica para evitar duplicatas em consultas combinadas
- Retorna null quando documento não existe
- Utiliza coleção "rides" no Firestore
- Essencial para persistência de dados de corridas
