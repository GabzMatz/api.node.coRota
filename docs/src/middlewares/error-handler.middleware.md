# error-handler.middleware.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `error-handler.middleware.ts` localizado em `middlewares`. Este middleware gerencia o tratamento centralizado de erros da aplicação, capturando exceções e retornando respostas padronizadas.

## ⚙️ Fluxo de Funcionamento
Este middleware atua no fluxo de requisição HTTP para capturar e tratar erros. É responsável por:
- Interceptar erros lançados em qualquer parte da aplicação
- Processar erros de validação do Celebrate
- Verificar se o erro é uma instância de ErrorBase
- Enviar resposta padronizada para erros customizados
- Enviar erro interno do servidor para erros não tratados
- Garantir que todos os erros sejam capturados e respondidos

## 🔗 Depende de
**Dependências internas:**
- `../errors/internal-server.error.js` - Erro customizado para erro interno
- `../errors/base.error.js` - Classe base para erros customizados (ErrorBase)

**Dependências externas:**
- `express` - Framework web para Node.js (NextFunction, Request, Response)
- `celebrate` - Biblioteca para validação de dados (errors)

## 🧩 Usado por
- `../index.ts` - Arquivo principal da aplicação
- Todas as rotas da aplicação
- Sistema de tratamento de erros

## 🗒️ Observações
- Middleware especializado em tratamento de erros
- Processa erros de validação do Celebrate automaticamente
- Distingue entre erros customizados e erros não tratados
- Garante respostas padronizadas para todos os erros
- Deve ser o último middleware registrado na aplicação
- Essencial para estabilidade e debugging da aplicação
