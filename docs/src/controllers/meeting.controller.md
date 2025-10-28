# meeting.controller.md

## 📘 Propósito
Descreve o objetivo principal do módulo `meeting.controller.ts` localizado em `controllers`. Este controller gerencia operações relacionadas ao cálculo de pontos de encontro entre usuários.

## ⚙️ Fluxo de Funcionamento
Este controller recebe requisições HTTP relacionadas ao cálculo de pontos de encontro e chama o `MeetingService` correspondente para processar a lógica de negócio. É responsável por:
- Calcular ponto de encontro entre duas pessoas (`POST /meeting/calculate`)

## 🔗 Depende de
**Dependências internas:**
- `../services/meeting.service.js` - Serviço de cálculo de pontos de encontro

**Dependências externas:**
- `express` - Framework web para Node.js (Request, Response, NextFunction)

## 🧩 Usado por
- `../routes/meeting.routes.ts` - Mapeamento das rotas de pontos de encontro
- Sistema de sugestão de corridas
- Sistema de otimização de rotas

## 🗒️ Observações
- Controller especializado em operações de cálculo de pontos de encontro
- Utiliza métodos estáticos para facilitar o uso nas rotas
- Recebe coordenadas de duas pessoas como entrada
- Retorna coordenadas do ponto de encontro calculado
- Essencial para funcionalidade de carona compartilhada
