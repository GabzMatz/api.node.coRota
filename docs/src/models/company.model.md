# company.model.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `company.model.ts` localizado em `models`. Este model define a estrutura de dados e validações para empresas cadastradas no sistema, incluindo interfaces TypeScript e schemas de validação Joi.

## ⚙️ Fluxo de Funcionamento
Este model define a estrutura de dados para empresas e é utilizado em toda a aplicação para validação e tipagem. É responsável por:
- Definir interface Company com propriedades da empresa
- Definir interface SearchCompany para funcionalidade de busca
- Estender interface Base para campos comuns
- Definir schemas de validação Joi para empresas e busca
- Validar dados de entrada em controllers e services

## 🔗 Depende de
**Dependências internas:**
- `./base.model.js` - Modelo base com campos comuns (Base)

**Dependências externas:**
- `celebrate` - Biblioteca para validação de dados (Joi)

## 🧩 Usado por
- `../controllers/company.controller.ts` - Controller de empresas
- `../services/companies.service.ts` - Service de empresas
- `../repositories/companies.repository.ts` - Repository de empresas
- Sistema de cadastro de usuários
- Sistema de busca de empresas

## 🗒️ Observações
- Model especializado em estrutura de dados de empresas
- Inclui lista opcional de emails de usuários da empresa
- Interface SearchCompany específica para funcionalidade de busca
- Validação obrigatória para nome e addressId
- Schema Joi para validação de dados de entrada
- Essencial para funcionalidade de empresas e cadastro de usuários
