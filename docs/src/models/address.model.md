# address.model.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `address.model.ts` localizado em `models`. Este model define a estrutura de dados e validações para endereços dos usuários, incluindo interfaces TypeScript e schemas de validação Joi.

## ⚙️ Fluxo de Funcionamento
Este model define a estrutura de dados para endereços e é utilizado em toda a aplicação para validação e tipagem. É responsável por:
- Definir interface Address com propriedades de localização
- Estender interface Base para campos comuns
- Definir schema de validação Joi para endereços
- Validar dados de entrada em controllers e services

## 🔗 Depende de
**Dependências internas:**
- `./base.model.js` - Modelo base com campos comuns (Base)

**Dependências externas:**
- `celebrate` - Biblioteca para validação de dados (Joi)

## 🧩 Usado por
- `../controllers/address.controller.ts` - Controller de endereços
- `../services/address.service.ts` - Service de endereços
- `../repositories/address.repository.ts` - Repository de endereços
- Sistema de cadastro de usuários
- Sistema de criação de corridas

## 🗒️ Observações
- Model especializado em estrutura de dados de endereços
- Inclui coordenadas geográficas (lat, long) para localização
- Validação obrigatória para campos essenciais
- Campo complement opcional para informações adicionais
- Schema Joi para validação de dados de entrada
- Essencial para funcionalidade de localização e mapas
