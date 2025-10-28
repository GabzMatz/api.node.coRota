# rides.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `rides.service.ts` localizado em `services`. Este service gerencia toda a lógica de negócio relacionada às corridas e funcionalidades de carona compartilhada, incluindo criação, gerenciamento e sugestão de corridas.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para corridas e conecta com repositories e serviços externos. É responsável por:
- Verificar e completar corridas expiradas automaticamente
- Listar corridas ativas com assentos disponíveis
- Buscar corrida por ID com validação de existência
- Criar novas corridas com histórico de motorista
- Atualizar corridas existentes
- Permitir que passageiros escolham corridas
- Cancelar corridas como passageiro ou motorista
- Sugerir corridas baseadas em proximidade e rota

## 🔗 Depende de
**Dependências internas:**
- `../repositories/rides.repository.js` - Repository para persistência de dados
- `../models/base.model.js` - Modelo de dados base (LatLng)
- `../services/mapbox.service.js` - Service de integração com Mapbox
- `../models/ride.model.js` - Modelo de dados da corrida (Ride, SearchRide)
- `../errors/not-found.error.js` - Erro customizado para recursos não encontrados
- `../errors/validation.error.js` - Erro customizado para validação
- `../models/rides-history.model.js` - Modelo de dados do histórico (RideRole, RidesHistory, RideStatus)
- `../services/rides-history.service.js` - Service de histórico de corridas

**Dependências externas:**
- `process.env.MEET_THRESHOLD_METERS` - Limite de metros extras para sugestão de corridas

## 🧩 Usado por
- `../controllers/rides.controller.ts` - Controller de corridas
- `../cron/ride-completion-cron.ts` - Cron job para completar corridas expiradas
- Sistema de carona compartilhada

## 🗒️ Observações
- Service especializado em operações de corridas
- Implementa algoritmo de sugestão baseado em proximidade de rota
- Gerencia automaticamente assentos disponíveis
- Integra com Mapbox para cálculo de rotas e distâncias
- Cron job automático para completar corridas expiradas
- Validações específicas para motoristas e passageiros
- Essencial para funcionalidade principal do sistema
