# index.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `index.ts` localizado em `src`. Este arquivo serve como ponto de inicialização do módulo principal da aplicação Node.js, configurando servidor Express, middlewares, rotas e serviços externos.

## ⚙️ Fluxo de Funcionamento
Este arquivo inicializa e configura toda a aplicação Node.js. É responsável por:
- Inicializar aplicações Firebase (Admin e Client)
- Configurar servidor Express com middlewares
- Registrar middleware CORS para requisições cross-origin
- Configurar middleware de autenticação
- Registrar todas as rotas da aplicação
- Configurar middlewares de tratamento de erros
- Iniciar cron job para completar corridas expiradas
- Iniciar servidor HTTP na porta configurada

## 🔗 Depende de
**Dependências internas:**
- `./routes/index.js` - Configuração de todas as rotas
- `./middlewares/page-not-found.middleware.js` - Middleware de rotas não encontradas
- `./middlewares/error-handler.middleware.js` - Middleware de tratamento de erros
- `./middlewares/auth.middleware.js` - Middleware de autenticação
- `./cron/ride-completion-cron.js` - Cron job para corridas expiradas

**Dependências externas:**
- `express` - Framework web para Node.js
- `firebase-admin/app` - SDK do Firebase Admin (initializeApp)
- `firebase/app` - SDK do Firebase Client (initializeApp)
- `cors` - Middleware para requisições cross-origin
- `process.env` - Variáveis de ambiente (PORT, API_KEY)

## 🧩 Usado por
- Sistema de inicialização da aplicação
- Processo principal do Node.js
- Servidor de produção

## 🌐 Deploy
A aplicação é implantada como uma **Cloud Function do Firebase** e está disponível em:
- **URL de Produção**: [https://us-central1-corota-fe133.cloudfunctions.net/api](https://us-central1-corota-fe133.cloudfunctions.net/api)
- **Frontend**: [https://appreactcorota.vercel.app/](https://appreactcorota.vercel.app/)

A função é exportada como `api` e exposta via `onRequest` do Firebase Functions, permitindo que o Express seja executado como uma Cloud Function HTTP.

## 🗒️ Observações
- Arquivo principal de inicialização da aplicação
- Configuração completa do servidor Express
- Inicialização de serviços Firebase (Admin e Client)
- Middleware CORS habilitado para todas as origens
- Exporta Cloud Function do Firebase (`api`)
- Cron job iniciado automaticamente
- Middlewares registrados em ordem específica
- Essencial para funcionamento da aplicação
- Deploy realizado via Firebase Functions