import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Carrinho.css';

function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5053/cart')
      .then(response => {
        setCarrinho(response.data);
      })
      .catch(error => {
        console.error("Erro ao carregar o carrinho: ", error);
      });
  }, []);

  const aumentarQuantidade = (produtoId) => {
    const item = carrinho.find(item => item.produtoId === produtoId);
    if (item) {
      const novoCarrinho = carrinho.map(item =>
        item.produtoId === produtoId
          ? { ...item, quantidade: item.quantidade + 1 }
          : item
      );
      setCarrinho(novoCarrinho);
      axios.post(`http://localhost:5053/cart/${produtoId}`, {
        produtoId: item.produtoId,
        quantidade: 1, 
      })
        .catch(error => console.error("Erro ao atualizar o carrinho: ", error));
    }
  };

  const diminuirQuantidade = (produtoId) => {
    const item = carrinho.find(item => item.produtoId === produtoId);
    if (item && item.quantidade > 1) {
      const novoCarrinho = carrinho.map(item =>
        item.produtoId === produtoId
          ? { ...item, quantidade: item.quantidade - 1 }
          : item
      );
      setCarrinho(novoCarrinho);
      axios.post(`http://localhost:5053/cart/${produtoId}`, {
        produtoId: item.produtoId,
        quantidade: -1, 
      })
        .catch(error => console.error("Erro ao atualizar o carrinho: ", error));
    }
  };

  const excluirItem = (produtoId) => {
    const novoCarrinho = carrinho.filter(item => item.produtoId !== produtoId);
    setCarrinho(novoCarrinho);
    axios.delete(`http://localhost:5053/cart/${produtoId}`)
      .catch(error => console.error("Erro ao excluir item: ", error));
  };

  const criarPedido = () => {
    const pedido = {
      Status: 'criado',
      DataPedido: new Date().toISOString(), 
      Itens: carrinho,
    };
  
    axios.post('http://localhost:5053/criar-pedido', pedido)
      .then(response => {
        alert('Pedido criado com sucesso!');
        setCarrinho([]);
      })
      .catch(error => {
        console.error('Erro ao criar o pedido:', error);
        alert('Erro ao criar o pedido.');
      });
  };
  

  return (
    <div>
      <h1>Carrinho</h1>
      <div className="carrinho">
        {carrinho.map((item) => (
          <div key={item.produtoId} className="card">
            <div className="card-body">
              <h3>{item.nomeProduto}</h3>
              <p>Preço: R$ {item.preco}</p>
              <div>
                <button onClick={() => diminuirQuantidade(item.produtoId)}>-</button>
                <span>{item.quantidade}</span>
                <button onClick={() => aumentarQuantidade(item.produtoId)}>+</button>
              </div>
              <button onClick={() => excluirItem(item.produtoId)}>Excluir</button>
            </div>
          </div>
        ))}
      </div>
      {carrinho.length > 0 && (
        <div>
          <button onClick={criarPedido} className="btn-finalizar">
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
}

export default Carrinho;
