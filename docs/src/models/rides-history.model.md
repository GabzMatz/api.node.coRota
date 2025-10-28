# rides-history.model.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `rides-history.model.ts` localizado em `models`. Este model define a estrutura de dados e validações para histórico de corridas dos usuários, incluindo interfaces TypeScript, enums e schemas de validação Joi.

## ⚙️ Fluxo de Funcionamento
Este model define a estrutura de dados para histórico de corridas e é utilizado em toda a aplicação para validação e tipagem. É responsável por:
- Definir enums RideRole e RideStatus para controle de estado
- Definir interface RidesHistory com propriedades do histórico
- Estender interface Base para campos comuns
- Definir schema de validação Joi para histórico
- Validar dados de entrada em controllers e services

## 🔗 Depende de
**Dependências internas:**
- `./base.model.js` - Modelo base com campos comuns (Base)
- `./ride.model.js` - Modelo de dados da corrida (Ride)

**Dependências externas:**
- `celebrate` - Biblioteca para validação de dados (Joi)

## 🧩 Usado por
- `../controllers/rides-history.controller.ts` - Controller de histórico
- `../services/rides-history.service.ts` - Service de histórico
- `../repositories/rides-history.repository.ts` - Repository de histórico
- `../services/rides.service.ts` - Service de corridas
- Sistema de relatórios de corridas

## 🗒️ Observações
- Model especializado em estrutura de dados de histórico de corridas
- Enums para controle de roles (DRIVER, PASSENGER) e status (COMPLETED, CANCELED, PENDING)
- Interface RidesHistory com referência completa à corrida
- Validação de roles e status através de enums
- Schema Joi para validação de dados de entrada
- Essencial para auditoria e relatórios do sistema
