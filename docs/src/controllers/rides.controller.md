# rides.controller.md

## 📘 Propósito
Descreve o objetivo principal do módulo `rides.controller.ts` localizado em `controllers`. Este controller gerencia as operações CRUD relacionadas às corridas e funcionalidades de carona compartilhada.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas às corridas e chama o `RidesService` correspondente para processar a lógica de negócio. É responsável por:
- Listar todas as corridas (`GET /rides`)
- Buscar corrida por ID (`GET /rides/:id`)
- Criar nova corrida (`POST /rides`)
- Atualizar corrida existente (`PUT /rides/:id`)
- Escolher corrida como passageiro (`POST /rides/:rideId/choose/:userId`)
- Cancelar corrida como passageiro (`DELETE /rides/:rideId/passenger/:userId`)
- Cancelar corrida como motorista (`DELETE /rides/:rideId/driver/:userId`)
- Sugerir corridas (`POST /rides/suggest`)

## 🔗 Depende de
**Dependências internas:**
- `../services/rides.service.js` - Serviço de corridas para lógica de negócio
- `../models/ride.model.js` - Modelo de dados da corrida (SearchRide)

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response, NextFunction)

## 🧩 Usado por
- `../routes/rides.routes.ts` - Mapeamento das rotas de corridas
- Sistema de carona compartilhada
- Sistema de sugestão de corridas

## 🗒️ Observações
- Controller especializado em operações de corridas
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Implementa operações CRUD completas
- Funcionalidades específicas para motoristas e passageiros
- Sistema de sugestão de corridas baseado em critérios
- Requer autenticação para operações sensíveis
