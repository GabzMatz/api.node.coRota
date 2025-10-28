# user.model.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `user.model.ts` localizado em `models`. Este model define a estrutura de dados e validações para usuários do sistema, incluindo interfaces TypeScript e schemas de validação Joi.

## ⚙️ Fluxo de Funcionamento
Este model define a estrutura de dados para usuários e é utilizado em toda a aplicação para validação e tipagem. É responsável por:
- Definir interface User com propriedades do usuário
- Estender interface Base para campos comuns
- Definir schemas de validação Joi para diferentes operações
- Validar dados de entrada em controllers e services
- Suportar operações de criação, atualização, login e recuperação

## 🔗 Depende de
**Dependências internas:**
- `./base.model.js` - Modelo base com campos comuns (Base)

**Dependências externas:**
- `celebrate` - Biblioteca para validação de dados (Joi)

## 🧩 Usado por
- `../controllers/user.controller.ts` - Controller de usuários
- `../controllers/auth.controller.ts` - Controller de autenticação
- `../services/user.service.ts` - Service de usuários
- `../services/auth.service.ts` - Service de autenticação
- `../repositories/user.repository.ts` - Repository de usuários
- `../middlewares/auth.middleware.ts` - Middleware de autenticação
- Sistema de autenticação e cadastro

## 🗒️ Observações
- Model especializado em estrutura de dados de usuários
- Inclui informações pessoais e profissionais (CPF, telefone, empresa)
- Validação específica para CPF com padrão de 11 dígitos
- Schemas separados para criação, atualização, login e recuperação
- Campo hasCar para funcionalidade de carona compartilhada
- Campo workSchedule para otimização de horários
- Validação de email corporativo obrigatório
- Essencial para funcionalidade de autenticação e usuários
