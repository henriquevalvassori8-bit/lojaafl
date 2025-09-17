// Apenas um exemplo de como configurar as rotas
/*const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = 3000;

// Carregar variáveis de ambiente
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Inicializar o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Middleware para processar JSON
app.use(express.json());

// Rota para a página de cadastro de produtos
app.post('/api/cadastrar-produto', async (req, res) => {
  const { nome, categoria, descricao, preco, loja, imagem_url, link } = req.body;

  try {
    const { data, error } = await supabase
      .from('produtos')
      .insert([{
        nome,
        categoria,
        descricao,
        preco,
        loja,
        imagem_url,
        link
      }]);

    if (error) {
      console.error('Erro ao cadastrar produto:', error);
      return res.status(500).json({ error: 'Erro ao cadastrar produto.' });
    }

    res.status(201).json({ message: 'Produto cadastrado com sucesso!', data });
  } catch (err) {
    console.error('Erro no servidor:', err);
    res.status(500).json({ error: 'Erro no servidor.' });
  }
});

// Outras rotas para buscar produtos, filtrar, etc.
app.get('/api/produtos', async (req, res) => {
  const { categoria } = req.query;
  let query = supabase.from('produtos').select('*');

  if (categoria) {
    query = query.eq('categoria', categoria);
  }

  const { data, error } = await query;

  if (error) {
    return res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }

  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});*/