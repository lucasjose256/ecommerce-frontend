import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ProdutoList.css'

function ProdutoList() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);

  // Função para adicionar produto ao carrinho
  const adicionarAoCarrinho = (produtoId, quantidade) => {
    const produto = produtos.find((prod) => prod.id === produtoId);
    if (!produto) return;

    // Criando o corpo da requisição para o POST
    const item = {
      produtoId: produto.id,
      quantidade: quantidade,
    };

    // Fazendo o POST para adicionar o produto ao carrinho usando axios
    axios.post(`http://localhost:5053/cart/${produto.id}`, item, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        alert(response.data.mensagem); // Exibe a mensagem de sucesso
        // Atualiza o carrinho com o item adicionado
        setCarrinho((prevCarrinho) => {
          // Verifica se o item já existe no carrinho
          const itemExistente = prevCarrinho.find((item) => item.produtoId === produto.id);

          if (itemExistente) {
            // Se o item já existir, apenas atualiza a quantidade
            return prevCarrinho.map((item) =>
              item.produtoId === produto.id
                ? { ...item, quantidade: item.quantidade + quantidade }
                : item
            );
          } else {
            // Se o item não existir, adiciona um novo item
            return [
              ...prevCarrinho,
              { produtoId: produto.id, nomeProduto: produto.nome, quantidade, preco: produto.preco },
            ];
          }
        });
      })
      .catch((error) => {
        console.error('Erro ao adicionar ao carrinho:', error);
      });
  };

  useEffect(() => {
    // Carrega os produtos da API
    axios.get('http://localhost:5053/produtos')
      .then((response) => {
        setProdutos(response.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar os produtos:', error);
      });
  }, []);

  useEffect(() => {
    // Carrega o carrinho da API
    axios.get('http://localhost:5053/cart')
      .then((response) => {
        setCarrinho(response.data); // Supondo que a API retorna a lista de itens no carrinho
      })
      .catch((error) => {
        console.error('Erro ao carregar o carrinho:', error);
      });
  }, []);

  return (
    <div>
      <h1>Produtos</h1>
      <div className="produto-list">
        {produtos.map((produto) => (
          <div key={produto.id} className="produto-card">
            <img src={produto.image} alt={produto.nome} className="produto-image" />
            <div className="produto-details">
              <h3>{produto.nome}</h3>
              <p>Preço: R$ {produto.preco}</p>
              <p>estoque {produto.estoque}</p>
              <button
                onClick={() => adicionarAoCarrinho(produto.id, 1)} // Adiciona 1 unidade ao carrinho
                className="add-to-cart-btn"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2>Carrinho</h2>
      <ul>
        {carrinho.map((item, index) => (
          <li key={index}>
            {item.nomeProduto} - Quantidade: {item.quantidade} - Preço: R$ {item.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutoList;
