# base.model.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `base.model.ts` localizado em `models`. Este model define a estrutura base comum para todas as entidades do sistema, incluindo campos padrão e tipos utilitários.

## ⚙️ Fluxo de Funcionamento
Este model define a estrutura base para todas as entidades e é utilizado como base para outros models. É responsável por:
- Definir interface Base com campos comuns (id, timestamps, status)
- Definir tipo LatLng para coordenadas geográficas
- Definir schema de validação para IDs
- Prover estrutura comum para todas as entidades

## 🔗 Depende de
**Dependências internas:**
- Nenhuma dependência interna específica

**Dependências externas:**
- `celebrate` - Biblioteca para validação de dados (Joi)

## 🧩 Usado por
- Todos os outros models do sistema (Address, Company, Ride, RidesHistory, User)
- Controllers para validação de IDs
- Services para operações comuns
- Repositories para estrutura de dados

## 🗒️ Observações
- Model base para todas as entidades do sistema
- Define campos obrigatórios: id, createdAt, updatedAt, isActive
- Tipo LatLng para coordenadas geográficas [longitude, latitude]
- Schema de validação para IDs alfanuméricos
- Essencial para consistência de dados em toda a aplicação
- Evita duplicação de código entre models
