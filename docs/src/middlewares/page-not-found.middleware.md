# page-not-found.middleware.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `page-not-found.middleware.ts` localizado em `middlewares`. Este middleware gerencia requisições para rotas não encontradas, retornando erro 404 padronizado.

## ⚙️ Fluxo de Funcionamento
Este middleware atua no fluxo de requisição HTTP para capturar rotas não encontradas. É responsável por:
- Interceptar requisições que não correspondem a nenhuma rota definida
- Lançar erro NotFoundError com mensagem padronizada
- Garantir que todas as rotas não encontradas sejam tratadas
- Retornar resposta 404 consistente para o cliente

## 🔗 Depende de
**Dependências internas:**
- `../errors/not-found.error.js` - Erro customizado para recurso não encontrado

**Dependências externas:**
- `express` - Framework web para Node.js (NextFunction, Request, Response)

## 🧩 Usado por
- `../index.ts` - Arquivo principal da aplicação
- Sistema de roteamento
- Tratamento de rotas não encontradas

## 🗒️ Observações
- Middleware especializado em tratamento de rotas não encontradas
- Deve ser registrado após todas as rotas da aplicação
- Lança erro NotFoundError com mensagem "Página não encontrada!"
- Garante resposta consistente para rotas não definidas
- Essencial para experiência do usuário e debugging
