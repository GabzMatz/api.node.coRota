# geocode.controller.md

## 📘 Propósito
Descreve o objetivo principal do módulo `geocode.controller.ts` localizado em `controllers`. Este controller gerencia operações de geocodificação para busca de endereços e localizações.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas à geocodificação e chama o `GeocodeService` correspondente para processar a lógica de negócio. É responsável por:
- Buscar endereços por query string (`GET /geocode/search?q=termo`)

## 🔗 Depende de
**Dependências internas:**
- `../services/geocode.service.js` - Serviço de geocodificação para lógica de negócio

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response, NextFunction)

## 🧩 Usado por
- `../routes/geocode.routes.ts` - Mapeamento das rotas de geocodificação
- Sistema de busca de endereços
- Sistema de criação de corridas

## 🗒️ Observações
- Controller especializado em operações de geocodificação
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Recebe parâmetros via query string
- Integra com serviços de geocodificação externos
- Essencial para funcionalidade de busca de endereços
