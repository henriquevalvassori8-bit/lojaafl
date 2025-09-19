document.addEventListener('DOMContentLoaded', function() {
    // Função principal para carregar os produtos, agora com filtros de categoria e loja
    async function carregarProdutos(filtro = {}) {
        const { categoria, termoBusca, loja } = filtro;

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
            if (loja) { // NOVO: Adiciona o parâmetro da loja
                params.append('loja', loja);
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao carregar produtos do servidor.');
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
                 productsContainer.innerHTML = `<p class="no-products">Ocorreu um erro ao carregar os produtos: ${error.message}</p>`;
            }
        }
    }

    // Função para cadastrar produto via API
    async function cadastrarProduto(dados) {
        try {
            const response = await fetch('/api/cadastrar-produto', {
                method: 'POST',
                body: dados,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro desconhecido ao cadastrar produto.');
            }

            const result = await response.json();
            return { success: true, message: result.message };

        } catch (error) {
            console.error('Erro no cadastro:', error.message);
            return { success: false, error: error.message };
        }
    }

    // Lógica para o formulário de cadastro
    const formProduto = document.getElementById('cadastro-produto-form');
    if (formProduto) {
        formProduto.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(formProduto);
            
            const submitBtn = formProduto.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cadastrando...';
            submitBtn.disabled = true;

            const resultado = await cadastrarProduto(formData);
            
            if (resultado.success) {
                alert('Produto cadastrado com sucesso!');
                formProduto.reset();
            } else {
                alert(`Erro: ${resultado.error}`);
            }
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    }

    // Lógica para a vitrine de produtos (se o elemento existir)
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
        const searchInput = document.querySelector('.search-bar input');
        const searchButton = document.querySelector('.search-bar button');
        const filterButtons = document.querySelectorAll('.filters button');
        const storeButtons = document.querySelectorAll('.stores button'); // NOVO: Seleciona os botões de loja

        // Inicializa a página carregando todos os produtos
        carregarProdutos({});

        // Adiciona o evento de clique para os botões de filtro de categoria
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                storeButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const categoria = this.dataset.categoria;
                carregarProdutos({ categoria });
            });
        });
        
        // NOVO: Adiciona o evento de clique para os botões de filtro de loja
        storeButtons.forEach(button => {
            button.addEventListener('click', function() {
                storeButtons.forEach(btn => btn.classList.remove('active'));
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                const loja = this.dataset.loja;
                carregarProdutos({ loja });
            });
        });


        // Adiciona o evento de clique para o botão de busca
        if (searchButton) {
            searchButton.addEventListener('click', function(e) {
                e.preventDefault();
                const termoBusca = searchInput.value.trim();
                filterButtons.forEach(btn => btn.classList.remove('active'));
                storeButtons.forEach(btn => btn.classList.remove('active'));
                carregarProdutos({ termoBusca });
            });
        }

        // Adiciona o evento de "Enter" no campo de busca
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    const termoBusca = searchInput.value.trim();
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    storeButtons.forEach(btn => btn.classList.remove('active'));
                    carregarProdutos({ termoBusca });
                }
            });
        }
    }
});