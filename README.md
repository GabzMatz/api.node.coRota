# api.node.corota

## 📋 Descrição

API desenvolvida em **Node.js** utilizando **Express** e **Firebase Admin SDK** para o projeto **CoRota**, uma plataforma web que conecta colaboradores de empresas para o compartilhamento de caronas.  
Seu objetivo é reduzir custos de transporte, diminuir a emissão de poluentes e incentivar a mobilidade urbana sustentável por meio do uso inteligente de rotas e horários compatíveis entre motoristas e passageiros.

## 🌐 Deploy

- **Frontend**: [https://appreactcorota.vercel.app/](https://appreactcorota.vercel.app/)
- **API**: [https://us-central1-corota-fe133.cloudfunctions.net/api](https://us-central1-corota-fe133.cloudfunctions.net/api)

## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/)
- [Mapbox](https://www.mapbox.com/)
- [Celebrate](https://github.com/arb/celebrate) (Joi validation)
- [Node-cron](https://github.com/node-cron/node-cron)

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `functions` com as seguintes variáveis:

```env
# Firebase
API_KEY=sua_api_key_do_firebase

# Mapbox
MAPBOX_TOKEN=seu_token_do_mapbox

# Configurações de Corridas
MEET_THRESHOLD_METERS=3000
```

### Arquivos Necessários

- `functions/firebase-adminsdk.json` - Credenciais do Firebase Admin SDK (não versionado no Git por segurança)

### Firebase Functions

Este projeto é uma **Cloud Function do Firebase**, então você precisa ter:
- Conta Firebase configurada
- Firebase CLI instalado (`npm install -g firebase-tools`)
- Projeto Firebase inicializado (`firebase init`)

## ▶️ Como Executar

### Desenvolvimento Local

1. Navegue até a pasta `functions`:

   ```bash
   cd functions
   ```

2. Instale as dependências:

   ```bash
   npm i
   ```

3. Configure as variáveis de ambiente (arquivo `.env` na pasta `functions`)

4. Execute o emulador do Firebase:

   ```bash
   npm start
   ```
   e em outro terminal, dentro da pasta functions execute
   ```bash
   npm run build:watch
   ```

5. A API estará disponível no emulador local

### Deploy

Para fazer deploy da API no Firebase Functions:

```bash
cd functions
npm run deploy
```

A API será implantada em: `https://us-central1-corota-fe133.cloudfunctions.net/api`

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas bem definida:

```
┌─────────────────┐
│   Controllers   │ ← Recebem requisições HTTP
├─────────────────┤
│    Services     │ ← Lógica de negócio
├─────────────────┤
│  Repositories   │ ← Persistência de dados
├─────────────────┤
│     Models      │ ← Estrutura de dados
└─────────────────┘
```

### 🔄 Fluxo de Dados

1. **Request** → Controller recebe requisição HTTP
2. **Validation** → Middleware valida dados com Joi
3. **Business Logic** → Service processa lógica de negócio
4. **Data Access** → Repository acessa banco de dados (Firestore)
5. **Response** → Controller retorna resposta formatada

## 🛡️ Segurança

- **Autenticação JWT** - Tokens Firebase para autenticação
- **Validação de Dados** - Schemas Joi para validação de entrada
- **CORS** - Configurado para desenvolvimento temporariamente
- **Rate Limiting** - Implementado com express-rate-limit
- **Tratamento de Erros** - Middleware centralizado para captura de erros

## 📊 Banco de Dados

O projeto utiliza **Firebase Firestore** como banco de dados NoSQL com as seguintes coleções:

- `users` - Dados dos usuários
- `companies` - Dados das empresas
- `address` - Endereços cadastrados
- `rides` - Corridas criadas
- `rides-history` - Histórico de participações em corridas

## 🚀 Funcionalidades Principais

### 🚗 Sistema de Caronas Compartilhadas
- **Criação de Corridas** - Motoristas podem criar corridas com origem, destino e horário
- **Busca Inteligente** - Algoritmo que sugere corridas baseado em proximidade de rota
- **Gestão de Assentos** - Controle automático de assentos disponíveis
- **Cancelamento** - Diferentes fluxos para motoristas e passageiros

### 🗺️ Integração com Mapas
- **Geocodificação** - Busca de endereços via Mapbox
- **Pontos de Encontro** - Cálculo automático de pontos de encontro entre usuários
- **Otimização de Rotas** - Cálculo de distâncias e rotas otimizadas

### ⏰ Automação
- **Cron Jobs** - Tarefas automáticas para completar corridas expiradas
- **Notificações** - Sistema de notificações para usuários

## 📡 Endpoints Principais

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/recovery` - Recuperação de senha

### Usuários
- `GET /users` - Lista todos os usuários
- `GET /users/:id` - Busca usuário por ID
- `POST /users/register` - Registro de novo usuário
- `PUT /users/:id` - Atualiza dados do usuário
- `DELETE /users/:id` - Remove usuário

### Empresas
- `GET /companies` - Lista todas as empresas
- `GET /companies/:id` - Busca empresa por ID
- `POST /companies` - Cria nova empresa
- `POST /companies/search` - Busca empresas (público)
- `PUT /companies/:id` - Atualiza empresa
- `DELETE /companies/:id` - Remove empresa

### Corridas
- `POST /ride` - Cria nova corrida
- `GET /ride` - Lista corridas
- `GET /ride/:id` - Busca corrida por ID
- `PUT /ride/:id` - Atualiza corrida
- `POST /ride/suggest-rides` - Sugere corridas baseado em origem/destino
- `PUT /ride/:rideId/choose/:userId` - Passageiro escolhe uma corrida
- `PUT /ride/:rideId/calcel-passenger/:userId` - Passageiro cancela participação
- `PUT /ride/:rideId/calcel-driver/:userId` - Motorista cancela corrida

### Geocodificação e Rotas
- `GET /ride/geocode` - Busca endereços via Mapbox
- `POST /ride/meeting-point` - Calcula ponto de encontro entre usuários

### Endereços
- `GET /address` - Lista endereços do usuário
- `GET /address/:id` - Busca endereço por ID
- `POST /address/create` - Adiciona novo endereço
- `PUT /address/:id` - Atualiza endereço

### Histórico de Corridas
- `GET /ride-history` - Lista histórico de corridas
- `GET /ride-history/:id` - Busca histórico específico por ID
- `GET /ride-history/user/:id` - Busca histórico de corridas de um usuário

> **Nota**: A maioria dos endpoints requer autenticação via token Firebase JWT no header `Authorization: Bearer <token>`

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar emulador Firebase em modo desenvolvimento
npm start

# Build do projeto TypeScript
npm run build

# Build em modo watch
npm run build:watch

# Lint do código
npm run lint

# Deploy para Firebase Functions
npm run deploy

# Visualizar logs das Cloud Functions
npm run logs
```

### Estrutura do Projeto

```
functions/
├── src/
│   ├── @types/          # Extensões de tipos TypeScript
│   ├── controllers/     # Controladores HTTP
│   ├── cron/           # Tarefas agendadas
│   ├── errors/         # Erros customizados
│   ├── middlewares/    # Middlewares Express
│   ├── models/         # Modelos de dados e validações
│   ├── repositories/   # Camada de acesso a dados
│   ├── routes/         # Definição de rotas
│   ├── services/       # Lógica de negócio
│   └── index.ts        # Arquivo principal (Cloud Function)
├── lib/                # Código compilado (TypeScript → JavaScript)
├── package.json        # Dependências e scripts
└── tsconfig.json       # Configuração TypeScript
```

### Padrões de Código

- **TypeScript** - Tipagem estática para melhor manutenibilidade
- **Arquitetura em Camadas** - Separação clara de responsabilidades
- **Validação com Joi** - Schemas para validação de dados
- **Tratamento de Erros** - Erros customizados com códigos HTTP
- **Async/Await** - Uso consistente de promises

