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

## 🗒️ Observações
- Arquivo principal de inicialização da aplicação
- Configuração completa do servidor Express
- Inicialização de serviços Firebase (Admin e Client)
- Middleware CORS habilitado para todas as origens (para testes)
- Porta configurável via variável de ambiente (padrão 3000)
- Cron job iniciado automaticamente
- Middlewares registrados em ordem específica
- Essencial para funcionamento da aplicação