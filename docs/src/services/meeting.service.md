# meeting.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `meeting.service.ts` localizado em `services`. Este service gerencia operações relacionadas ao cálculo de pontos de encontro entre usuários, utilizando algoritmos de roteamento e geocodificação.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para cálculo de pontos de encontro e conecta com serviços de mapas. É responsável por:
- Calcular ponto de encontro entre duas pessoas
- Obter direções entre os pontos de origem
- Calcular ponto médio ao longo da rota
- Realizar geocodificação reversa para obter endereço do ponto de encontro
- Validar dados de entrada

## 🔗 Depende de
**Dependências internas:**
- `../errors/not-found.error.js` - Erro customizado para recursos não encontrados
- `../errors/validation.error.js` - Erro customizado para validação
- `../models/base.model.js` - Modelo de dados base (LatLng)
- `../models/ride.model.js` - Modelo de dados da rota (Route)
- `../services/mapbox.service.js` - Service de integração com Mapbox

**Dependências externas:**
- Nenhuma dependência externa direta (usa MapboxService)

## 🧩 Usado por
- `../controllers/meeting.controller.ts` - Controller de pontos de encontro
- Sistema de sugestão de corridas
- Sistema de otimização de rotas

## 🗒️ Observações
- Service especializado em cálculo de pontos de encontro
- Valida dados de entrada antes de processar
- Utiliza algoritmo de ponto médio ao longo da rota real
- Integra com Mapbox para direções e geocodificação reversa
- Retorna dados estruturados do ponto de encontro
- Essencial para funcionalidade de carona compartilhada
