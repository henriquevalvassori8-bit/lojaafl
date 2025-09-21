// server.js
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// O Express precisa saber de onde servir os arquivos estáticos.
// 'public' é a pasta onde seus arquivos HTML, CSS e JS estarão.
app.use(express.static(path.join(__dirname, 'public')));

// Define uma rota para a página principal.
// Isso garante que, se o usuário acessar a URL raiz, ele receba sua página principal.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Inicia o servidor e o faz "escutar" por requisições na porta definida
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});