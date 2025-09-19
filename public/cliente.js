document.addEventListener('DOMContentLoaded', function() {
    // Função principal para carregar os produtos
    async function carregarProdutos(categoria = null, termoBusca = null) {
        try {
            const productsContainer = document.getElementById('products-container');
            if (!productsContainer) {
                console.log("Elemento products-container não encontrado. Verifique seu HTML.");
                return;
            }

            let url = '/api/produtos';
            const params = new URLSearchParams();

            if (categoria) {
                params.append('categoria', categoria);
            }
            if (termoBusca) {
                params.append('termo', termoBusca);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Erro ao carregar produtos do servidor.');
            }

            const produtos = await response.json();
            productsContainer.innerHTML = '';

            if (produtos.length === 0) {
                productsContainer.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
                return;
            }

            produtos.forEach(produto => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${produto.imagem_url}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/300x200?text=Imagem+Nao+Disponivel'">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <strong>R$ ${parseFloat(produto.preco).toFixed(2)}</strong>
                    <a href="${produto.link}" target="_blank">Ver Produto!</a>
                `;
                productsContainer.appendChild(productCard);
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error.message);
            const productsContainer = document.getElementById('products-container');
            if (productsContainer) {
                productsContainer.innerHTML = '<p class="no-products">Ocorreu um erro ao carregar os produtos. Tente novamente mais tarde.</p>';
            }
        }
    }

    // Lógica para a vitrine de produtos (se o elemento existir)
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        const searchInput = document.querySelector('.search-bar input');
        const searchButton = document.querySelector('.search-bar button');
        const filterButtons = document.querySelectorAll('.filters button');

        // Inicializa a página carregando todos os produtos
        carregarProdutos();

        // Adiciona o evento de clique para os botões de filtro
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const categoria = this.dataset.categoria;
                carregarProdutos(categoria);
            });
        });

        // Adiciona o evento de clique para o botão de busca
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                const termoBusca = searchInput.value.trim();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                carregarProdutos(null, termoBusca);
            });
        }

        // Adiciona o evento de "Enter" no campo de busca
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const termoBusca = searchInput.value.trim();
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    carregarProdutos(null, termoBusca);
                }
            });
        }
    }
});
