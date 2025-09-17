// Importa as bibliotecas necessárias
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const multer = require('multer');

// Inicializa o aplicativo Express
const app = express();
const port = 3000;

// Configura o multer para lidar com o upload de arquivos na memória
const upload = multer({ storage: multer.memoryStorage() });

// Configura o middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Recupera as variáveis de ambiente para conexão com o Supabase
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Inicializa o cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Rota para listar todos os produtos ou filtrar por categoria
app.get('/api/produtos', async (req, res) => {
  const { categoria } = req.query;
  let query = supabase.from('produtos').select('*');

  if (categoria) {
    query = query.eq('categoria', categoria);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar produtos:', error);
    return res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }

  res.status(200).json(data);
});

// Rota para cadastrar um novo produto com upload de imagem
app.post('/api/cadastrar-produto', upload.single('imagem'), async (req, res) => {
  const { nome, categoria, descricao, preco, loja, link } = req.body;
  const imagemFile = req.file;

  if (!imagemFile) {
    return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
  }

  // Define o caminho e o nome do arquivo no Storage
  const fileName = `${Date.now()}-${imagemFile.originalname}`;
  const filePath = `produtos/${fileName}`;

  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('imagens-produtos') // Corrigido: Agora usa o novo nome do bucket
      .upload(filePath, imagemFile.buffer, {
        contentType: imagemFile.mimetype,
      });

    if (uploadError) {
      console.error('Erro no upload da imagem:', uploadError);
      return res.status(500).json({ error: 'Erro ao fazer upload da imagem.' });
    }

    const { data: publicUrlData } = supabase.storage
      .from('imagens-produtos') // Corrigido: Agora usa o novo nome do bucket
      .getPublicUrl(filePath);

    const imagem_url = publicUrlData.publicUrl;

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

// Inicia o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});