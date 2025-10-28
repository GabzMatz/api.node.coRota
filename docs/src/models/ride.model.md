# ride.model.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `ride.model.ts` localizado em `models`. Este model define a estrutura de dados e validações para corridas e funcionalidades de carona compartilhada, incluindo interfaces TypeScript e schemas de validação Joi.

## ⚙️ Fluxo de Funcionamento
Este model define a estrutura de dados para corridas e é utilizado em toda a aplicação para validação e tipagem. É responsável por:
- Definir interface Ride com propriedades da corrida
- Definir interface Route para dados de localização
- Definir interface SearchRide para funcionalidade de busca
- Estender interface Base para campos comuns
- Definir schemas de validação Joi para corridas e busca
- Validar dados de entrada em controllers e services

## 🔗 Depende de
**Dependências internas:**
- `./base.model.js` - Modelo base com campos comuns (Base, LatLng)

**Dependências externas:**
- `celebrate` - Biblioteca para validação de dados (Joi)
- `firebase-admin/firestore` - SDK do Firebase Admin (Timestamp)

## 🧩 Usado por
- `../controllers/rides.controller.ts` - Controller de corridas
- `../services/rides.service.ts` - Service de corridas
- `../repositories/rides.repository.ts` - Repository de corridas
- `../services/geocode.service.ts` - Service de geocodificação
- `../services/meeting.service.ts` - Service de pontos de encontro
- Sistema de carona compartilhada

## 🗒️ Observações
- Model especializado em estrutura de dados de corridas
- Inclui coordenadas geográficas para origem e destino
- Gerencia assentos disponíveis e total de assentos
- Interface Route para dados de localização formatados
- Interface SearchRide para funcionalidade de busca de corridas
- Validação de preços com precisão decimal
- Campo extraMeters para cálculo de distância adicional
- Essencial para funcionalidade principal do sistema
