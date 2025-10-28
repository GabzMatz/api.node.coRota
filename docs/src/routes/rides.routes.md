# rides.routes.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `rides.routes.ts` localizado em `routes`. Este arquivo define o mapeamento de endpoints relacionados às corridas e funcionalidades de carona compartilhada, incluindo operações CRUD e funcionalidades específicas.

## ⚙️ Fluxo de Funcionamento
Este arquivo mapeia endpoints de corridas e conecta com controllers correspondentes. É responsável por:
- Mapear endpoints de geocodificação (`GET /ride/geocode`)
- Mapear endpoint de cálculo de ponto de encontro (`POST /ride/meeting-point`)
- Mapear endpoint de sugestão de corridas (`POST /ride/suggest-rides`)
- Mapear operações CRUD de corridas (`POST`, `GET`, `PUT /ride`)
- Mapear operações específicas (escolher, cancelar corridas)
- Aplicar validação de dados com schemas Joi

## 🔗 Depende de
**Dependências internas:**
- `../controllers/meeting.controller.js` - Controller de pontos de encontro
- `../controllers/rides.controller.js` - Controller de corridas
- `../controllers/geocode.controller.js` - Controller de geocodificação
- `../models/ride.model.js` - Schemas de validação (rideSchema, rideIdsSchema, searchRideSchema)
- `../models/base.model.js` - Schema de validação (idSchema)

**Dependências externas:**
- `express` - Framework web para Node.js (Router)
- `express-async-handler` - Middleware para tratamento de erros assíncronos
- `celebrate` - Biblioteca para validação de dados (celebrate, Segments)

## 🧩 Usado por
- `../routes/index.ts` - Arquivo principal de rotas
- Sistema de carona compartilhada
- Sistema de sugestão de corridas

## 🗒️ Observações
- Arquivo de rotas especializado em corridas e funcionalidades relacionadas
- Inclui rotas de geocodificação e pontos de encontro
- Validação obrigatória de dados de entrada
- Uso de asyncHandler para tratamento de erros
- Schemas Joi para validação de dados e parâmetros
- Funcionalidades específicas para motoristas e passageiros
- Essencial para funcionalidade principal do sistema
