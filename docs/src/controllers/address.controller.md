# address.controller.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `address.controller.ts` localizado em `controllers`. Este controller gerencia as operações CRUD relacionadas aos endereços dos usuários.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas aos endereços e chama o `AddressService` correspondente para processar a lógica de negócio. É responsável por:
- Listar todos os endereços (`GET /addresses`)
- Buscar endereço por ID (`GET /addresses/:id`)
- Criar novo endereço (`POST /addresses`)
- Atualizar endereço existente (`PUT /addresses/:id`)

## 🔗 Depende de
**Dependências internas:**
- `../services/address.service.js` - Serviço de endereços para lógica de negócio

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response, NextFunction)

## 🧩 Usado por
- `../routes/address.routes.ts` - Mapeamento das rotas de endereços
- Sistema de cadastro de usuários
- Sistema de criação de corridas

## 🗒️ Observações
- Controller especializado em operações de endereços
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Implementa operações CRUD completas
- Retorna mensagens de sucesso padronizadas
- Requer autenticação para operações sensíveis
