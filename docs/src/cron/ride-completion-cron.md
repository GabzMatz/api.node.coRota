# ride-completion-cron.ts

## 📘 Propósito
Descreve o objetivo principal do módulo `ride-completion-cron.ts` localizado em `cron`. Este arquivo gerencia a execução automática agendada para verificar e completar corridas expiradas no sistema.

## ⚙️ Fluxo de Funcionamento
Este arquivo implementa um cron job que executa automaticamente a cada minuto. É responsável por:
- Agendar execução automática a cada minuto (`* * * * *`)
- Verificar corridas expiradas através do RidesService
- Completar automaticamente corridas que passaram do horário
- Executar em timezone específico (America/Sao_Paulo)
- Implementar shutdown graceful para parada do cron
- Tratar erros durante execução do cron job

## 🔗 Depende de
**Dependências internas:**
- `../services/rides.service.js` - Service de corridas para verificação de expiradas

**Dependências externas:**
- `node-cron` - Biblioteca para execução de tarefas agendadas (cron)

## 🧩 Usado por
- `../index.ts` - Arquivo principal da aplicação (importado dinamicamente)
- Sistema de gerenciamento de corridas
- Processo de limpeza automática

## 🗒️ Observações
- Arquivo especializado em execução automática agendada
- Executa a cada minuto para verificação contínua
- Timezone configurado para América/São_Paulo
- Implementa tratamento de erros com logs
- Shutdown graceful com handlers SIGINT e SIGTERM
- Inicia automaticamente quando aplicação é carregada
- Essencial para manutenção automática do sistema
