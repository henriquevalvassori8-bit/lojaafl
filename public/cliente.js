const productContainer = document.getElementById('product-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const cadastroForm = document.getElementById('cadastro-produto-form');
const messageElement = document.getElementById('message');

// Função para buscar e exibir os produtos
const fetchProducts = async (category = 'todos') => {
  productContainer.innerHTML = 'Carregando...';
  const url = category === 'todos' ? '/api/produtos' : `/api/produtos?categoria=${category}`;

  try {
    const response = await fetch(url);
    const products = await response.json();

    if (products.length === 0) {
      productContainer.innerHTML = '<p>Nenhum produto encontrado nesta categoria.</p>';
      return;
    }

    productContainer.innerHTML = '';
    products.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="${product.imagem_url}" alt="${product.nome}">
        <h3>${product.nome}</h3>
        <p>${product.descricao}</p>
        <p><strong>Preço:</strong> R$${parseFloat(product.preco).toFixed(2)}</p>
        <p><strong>Loja:</strong> ${product.loja}</p>
        <a href="${product.link}" target="_blank">Ver Produto</a>
      `;
      productContainer.appendChild(productCard);
    });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    productContainer.innerHTML = '<p>Erro ao carregar os produtos.</p>';
  }
};

// Eventos para os botões de filtro
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    fetchProducts(category);
  });
});

// Evento para o formulário de cadastro
cadastroForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value;
  const categoria = document.getElementById('categoria').value;
  const descricao = document.getElementById('descricao').value;
  const preco = parseFloat(document.getElementById('preco').value);
  const loja = document.getElementById('loja').value;
  const imagemFile = document.getElementById('imagem').files[0];
  const link = document.getElementById('link').value;

  const formData = new FormData();
  formData.append('nome', nome);
  formData.append('categoria', categoria);
  formData.append('descricao', descricao);
  formData.append('preco', preco);
  formData.append('loja', loja);
  formData.append('imagem', imagemFile);
  formData.append('link', link);

  try {
    const response = await fetch('/api/cadastrar-produto', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      messageElement.textContent = result.message;
      messageElement.style.color = 'green';
      cadastroForm.reset();
      fetchProducts(); // Atualiza a vitrine após o cadastro
    } else {
      messageElement.textContent = result.error;
      messageElement.style.color = 'red';
    }
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    messageElement.textContent = 'Erro ao conectar com o servidor.';
    messageElement.style.color = 'red';
  }
});

// Carrega os produtos quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
});