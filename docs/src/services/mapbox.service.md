# mapbox.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `mapbox.service.ts` localizado em `services`. Este service gerencia integração com a API do Mapbox para operações de geocodificação, geocodificação reversa, direções e cálculos de rotas.

## ⚙️ Fluxo de Funcionamento
Este service implementa integração com serviços externos do Mapbox. É responsável por:
- Geocodificação de endereços (busca por texto)
- Geocodificação reversa (busca por coordenadas)
- Obtenção de direções entre pontos
- Cálculo de ponto médio ao longo de uma rota
- Cálculo de distâncias entre coordenadas

## 🔗 Depende de
**Dependências internas:**
- `../models/base.model.js` - Modelo de dados base (LatLng)

**Dependências externas:**
- `axios` - Cliente HTTP para requisições à API do Mapbox
- `process.env.MAPBOX_TOKEN` - Token de autenticação do Mapbox

## 🧩 Usado por
- `../services/geocode.service.ts` - Service de geocodificação
- `../services/meeting.service.ts` - Service de pontos de encontro
- `../services/rides.service.ts` - Service de corridas para sugestões

## 🗒️ Observações
- Service especializado em integração com Mapbox
- Requer token de autenticação configurado nas variáveis de ambiente
- Implementa algoritmos de cálculo de distância usando fórmula de Haversine
- Suporta diferentes perfis de rota (driving, walking, etc.)
- Cálculo de ponto médio considera geometria real da rota
- Essencial para funcionalidades de mapas e navegação
