# companies.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `companies.service.ts` localizado em `services`. Este service gerencia toda a lógica de negócio relacionada às empresas cadastradas no sistema, incluindo operações CRUD e funcionalidades de busca.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para empresas e conecta com repositories. É responsável por:
- Listar todas as empresas cadastradas
- Buscar empresa por ID com validação de existência
- Criar novas empresas com timestamp de criação
- Atualizar empresas existentes com validação prévia
- Buscar empresas por nome com filtro case-insensitive
- Deletar empresas com validação de existência

## 🔗 Depende de
**Dependências internas:**
- `../errors/not-found.error.js` - Erro customizado para recursos não encontrados
- `../models/company.model.js` - Modelo de dados da empresa (Company, SearchCompany)
- `../repositories/companies.repository.js` - Repository para persistência de dados

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../controllers/company.controller.ts` - Controller de empresas
- Sistema de cadastro de usuários
- Sistema de busca de empresas

## 🗒️ Observações
- Service especializado em operações de empresas
- Implementa funcionalidade de busca com filtro por nome
- Validação de existência antes de operações de atualização e exclusão
- Gerencia automaticamente timestamps de criação e atualização
- Busca case-insensitive para melhor experiência do usuário
- Retorna array vazio quando nenhuma empresa é encontrada na busca
