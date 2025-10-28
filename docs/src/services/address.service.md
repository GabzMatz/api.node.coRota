# address.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `address.service.ts` localizado em `services`. Este service gerencia toda a lógica de negócio relacionada aos endereços dos usuários, incluindo operações CRUD e validações.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para endereços e conecta com repositories. É responsável por:
- Listar todos os endereços cadastrados
- Buscar endereço por ID com validação de existência
- Criar novos endereços com timestamp de criação
- Atualizar endereços existentes com validação prévia
- Gerenciar timestamps de criação e atualização

## 🔗 Depende de
**Dependências internas:**
- `../errors/not-found.error.js` - Erro customizado para recursos não encontrados
- `../repositories/address.repository.js` - Repository para persistência de dados
- `../models/address.model.js` - Modelo de dados do endereço

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../controllers/address.controller.ts` - Controller de endereços
- Sistema de cadastro de usuários
- Sistema de criação de corridas

## 🗒️ Observações
- Service especializado em operações de endereços
- Implementa validação de existência antes de operações de atualização
- Gerencia automaticamente timestamps de criação e atualização
- Retorna erros específicos quando endereço não é encontrado
- Mantém integridade dos dados através de validações
