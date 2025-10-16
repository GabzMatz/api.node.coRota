# index.ts

## Descrição
Este arquivo é responsável por inicializar a aplicação backend com **Express** e **Firebase Admin SDK**.  
Ele cria um servidor HTTP simples que responde a uma rota de teste (`/`).  
Serve como ponto de entrada básico para validar se o servidor e a integração com o Firebase estão funcionando corretamente.

## Estrutura do Código
- Importação do **Express** e do módulo **Firebase Admin**  
- Inicialização da aplicação Firebase  
- Criação da instância do servidor Express  
- Definição de uma rota GET (`/`) que retorna uma mensagem simples  
- Inicialização do servidor na porta 3000

### Explicação

- **Importações:**  
  `express` é o framework usado para gerenciar rotas e requisições HTTP.  
  `initializeApp` vem do pacote `firebase-admin/app` e é usado para habilitar o uso de serviços do Firebase no backend.

- **initializeApp():**  
  Inicializa a aplicação Firebase, permitindo futuras interações com autenticação, banco de dados, storage etc.

- **const app = express():**  
  Cria a instância principal do servidor Express.

- **app.get("/", ...):**  
  Define uma rota do tipo GET que responde com a mensagem `"Rota teste"`, útil para verificar se o servidor está ativo.

- **app.listen(3000):**  
  Faz o servidor escutar na porta **3000**, tornando-o acessível localmente via `http://localhost:3000/`.
