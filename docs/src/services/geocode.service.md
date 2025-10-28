# geocode.service.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `geocode.service.ts` localizado em `services`. Este service gerencia operações de geocodificação para busca de endereços e localizações, integrando com serviços de mapas externos.

## ⚙️ Fluxo de Funcionamento
Este service implementa a lógica de negócio para geocodificação e conecta com serviços externos de mapas. É responsável por:
- Buscar endereços por query string
- Validar parâmetros de busca obrigatórios
- Processar resultados de geocodificação
- Formatar dados de retorno para o padrão da aplicação

## 🔗 Depende de
**Dependências internas:**
- `../services/mapbox.service.js` - Service de integração com Mapbox
- `../models/ride.model.js` - Modelo de dados da rota (Route)
- `../errors/validation.error.js` - Erro customizado para validação

**Dependências externas:**
- Nenhuma dependência externa direta (usa MapboxService)

## 🧩 Usado por
- `../controllers/geocode.controller.ts` - Controller de geocodificação
- Sistema de busca de endereços
- Sistema de criação de corridas

## 🗒️ Observações
- Service especializado em operações de geocodificação
- Valida parâmetros obrigatórios antes de processar
- Integra com Mapbox para busca de endereços
- Formata dados de retorno para consistência com a aplicação
- Limita resultados para otimizar performance
- Essencial para funcionalidade de busca de endereços
