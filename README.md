# api.node.corota

## 📋 Descrição

API desenvolvida em **Node.js** utilizando **Express** e **Firebase Admin SDK** para o projeto **CoRota**, uma plataforma web que conecta colaboradores de empresas para o compartilhamento de caronas.  
Seu objetivo é reduzir custos de transporte, diminuir a emissão de poluentes e incentivar a mobilidade urbana sustentável por meio do uso inteligente de rotas e horários compatíveis entre motoristas e passageiros.

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

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Servidor
PORT=3000

# Firebase
API_KEY=sua_api_key_do_firebase

# Mapbox
MAPBOX_TOKEN=seu_token_do_mapbox

# Configurações de Corridas
MEET_THRESHOLD_METERS=3000
```

### Arquivos Necessários

- `firebase-adminsdk.json` - Credenciais do Firebase Admin SDK

## ▶️ Como Executar

1. Instale as dependências:

   ```bash
   npm i
   ```

2. Configure as variáveis de ambiente (arquivo `.env`)

3. Execute o servidor:

   ```bash
   npm start
   ```

4. Acesse no navegador ou via cURL:

   ```
   http://localhost:3000/
   ```

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

## 🛠️ Desenvolvimento

### Scripts Disponíveis

```bash
# Iniciar servidor em modo desenvolvimento
npm start
```

### Estrutura do Projeto

```
src/
├── @types/          # Extensões de tipos TypeScript
├── controllers/     # Controladores HTTP
├── cron/           # Tarefas agendadas
├── errors/         # Erros customizados
├── middlewares/    # Middlewares Express
├── models/         # Modelos de dados e validações
├── repositories/   # Camada de acesso a dados
├── routes/         # Definição de rotas
├── services/       # Lógica de negócio
└── index.ts        # Arquivo principal
```

### Padrões de Código

- **TypeScript** - Tipagem estática para melhor manutenibilidade
- **Arquitetura em Camadas** - Separação clara de responsabilidades
- **Validação com Joi** - Schemas para validação de dados
- **Tratamento de Erros** - Erros customizados com códigos HTTP
- **Async/Await** - Uso consistente de promises

