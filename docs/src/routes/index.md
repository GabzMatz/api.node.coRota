# index.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `index.ts` localizado em `routes`. Este arquivo serve como ponto central de configuração de todas as rotas da aplicação, registrando middlewares e conectando todas as rotas específicas.

## ⚙️ Fluxo de Funcionamento
Este arquivo configura o sistema de roteamento da aplicação e é responsável por:
- Registrar middleware express.json() para parsing de JSON
- Conectar todas as rotas específicas da aplicação
- Organizar a estrutura de roteamento centralizada
- Prover função routes() para configuração no app principal

## 🔗 Depende de
**Dependências internas:**
- `./rides.routes.js` - Rotas de corridas
- `./address.routes.js` - Rotas de endereços
- `./auth.route.js` - Rotas de autenticação
- `./user.route.js` - Rotas de usuários
- `./company.routes.js` - Rotas de empresas
- `./rides-history.routes.js` - Rotas de histórico

**Dependências externas:**
- `express` - Framework web para Node.js (Express)

## 🧩 Usado por
- `../index.ts` - Arquivo principal da aplicação
- Sistema de roteamento da aplicação

## 🗒️ Observações
- Arquivo central de configuração de rotas
- Registra middleware de parsing JSON
- Conecta todas as rotas específicas
- Função exportada routes() para configuração
- Organiza estrutura de roteamento modular
- Essencial para funcionamento da API
