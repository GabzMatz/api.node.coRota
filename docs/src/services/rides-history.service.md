# rides-history.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `rides-history.service.ts` localizado em `services`. Este service gerencia toda a lógica de negócio relacionada ao histórico de corridas dos usuários, incluindo operações CRUD e gerenciamento de status.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para histórico de corridas e conecta com repositories. É responsável por:
- Completar históricos de corridas quando uma corrida é finalizada
- Listar todo o histórico de corridas
- Buscar histórico por ID com validação de existência
- Criar novos registros de histórico com timestamp
- Atualizar registros de histórico existentes
- Buscar histórico por usuário específico
- Cancelar corridas como motorista (cancela todos os passageiros)
- Cancelar corridas como passageiro individual

## 🔗 Depende de
**Dependências internas:**
- `../errors/not-found.error.js` - Erro customizado para recursos não encontrados
- `../models/rides-history.model.js` - Modelo de dados do histórico (RidesHistory, RideStatus)
- `../repositories/rides-history.repository.js` - Repository para persistência de dados

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../controllers/rides-history.controller.ts` - Controller de histórico de corridas
- `../services/rides.service.ts` - Service de corridas para operações de histórico
- Sistema de relatórios de corridas

## 🗒️ Observações
- Service especializado em operações de histórico de corridas
- Gerencia diferentes status de corrida (PENDING, COMPLETED, CANCELED)
- Implementa lógica específica para cancelamento de motorista vs passageiro
- Validação de existência antes de operações de atualização
- Gerencia automaticamente timestamps de criação e atualização
- Essencial para auditoria e relatórios do sistema
