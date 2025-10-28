# validation.error.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `validation.error.ts` localizado em `errors`. Este arquivo define um erro customizado específico para quando dados de entrada não passam na validação.

## ⚙️ Fluxo de Funcionamento
Este arquivo define a classe ValidationError que estende ErrorBase. É responsável por:
- Representar erro quando dados são inválidos
- Retornar código de status HTTP 400 (Bad Request)
- Requerer mensagem customizada obrigatória
- Prover feedback específico sobre erro de validação

## 🔗 Depende de
**Dependências internas:**
- `./base.error.js` - Classe base para erros customizados (ErrorBase)

**Dependências externas:**
- Nenhuma dependência externa específica

## 🧩 Usado por
- `../services/geocode.service.ts` - Service de geocodificação
- `../services/meeting.service.ts` - Service de pontos de encontro
- `../services/rides.service.ts` - Service de corridas
- Sistema de validação de dados
- Validação de parâmetros obrigatórios

## 🗒️ Observações
- Erro customizado para dados inválidos
- Código de status HTTP 400 (Bad Request)
- Requer mensagem customizada obrigatória
- Usado em services para validação de parâmetros
- Diferente dos erros de validação do Celebrate
