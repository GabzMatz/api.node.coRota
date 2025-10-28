# company.controller.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `company.controller.ts` localizado em `controllers`. Este controller gerencia as operações CRUD relacionadas às empresas cadastradas no sistema.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas às empresas e chama o `CompanyService` correspondente para processar a lógica de negócio. É responsável por:
- Listar todas as empresas (`GET /companies`)
- Buscar empresa por ID (`GET /companies/:id`)
- Criar nova empresa (`POST /companies`)
- Atualizar empresa existente (`PUT /companies/:id`)
- Buscar empresas por critérios (`POST /companies/search`)
- Deletar empresa (`DELETE /companies/:id`)

## 🔗 Depende de
**Dependências internas:**
- `../services/companies.service.js` - Serviço de empresas para lógica de negócio
- `../models/company.model.js` - Modelo de dados da empresa (SearchCompany)

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response, NextFunction)

## 🧩 Usado por
- `../routes/company.routes.ts` - Mapeamento das rotas de empresas
- Sistema de cadastro de usuários
- Sistema de busca de empresas

## 🗒️ Observações
- Controller especializado em operações de empresas
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Implementa operações CRUD completas incluindo busca
- Retorna mensagens de sucesso padronizadas
- Funcionalidade de busca permite encontrar empresas por critérios específicos
