# rides-history.repository.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `rides-history.repository.ts` localizado em `repositories`. Este repository gerencia a persistência e manipulação de dados relacionados ao histórico de corridas dos usuários no banco de dados Firestore.

## ⚙️ Fluxo de Funcionamento
Este repository implementa a camada de acesso a dados para histórico de corridas e conecta diretamente com o Firestore. É responsável por:
- Listar todo o histórico de corridas
- Buscar histórico por ID específico
- Buscar histórico por usuário específico
- Buscar histórico por corrida específica
- Buscar histórico por usuário e corrida combinados
- Criar novos registros de histórico
- Atualizar registros de histórico existentes
- Gerenciar as coleções "rides-history" e "rides" no Firestore

## 🔗 Depende de
**Dependências internas:**
- `../models/rides-history.model.js` - Modelo de dados do histórico
- `../models/ride.model.js` - Modelo de dados da corrida

**Dependências externas:**
- `firebase-admin/firestore` - SDK do Firebase Admin para acesso ao Firestore (CollectionReference, getFirestore)

## 🧩 Usado por
- `../services/rides-history.service.ts` - Service de histórico de corridas para operações de negócio
- Sistema de relatórios de corridas
- Sistema de auditoria

## 🗒️ Observações
- Repository especializado em operações de histórico de corridas
- Implementa operações CRUD e consultas específicas para Firestore
- Gerencia automaticamente IDs de documentos
- Implementa joins entre coleções "rides-history" e "rides"
- Suporta consultas por múltiplos critérios
- Utiliza coleções "rides-history" e "rides" no Firestore
- Essencial para persistência de dados de histórico e auditoria
