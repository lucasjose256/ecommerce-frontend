import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Pagamento.css';
import axios from 'axios';

function Pagamento() {
  const { pedidoId } = useParams();
  const location = useLocation();

  const { pedido } = location.state || {};

  const handlePagamento = async (pedidoId, valor) => {
    try {
      const dadosPagamento = {
        PedidoId: pedidoId,
        Status: "Pendente",  
        Valor: valor         
      };
  
      const resposta = await fetch(`http://localhost:5053/pagamentos/${pedidoId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosPagamento),
      });
  
      if (resposta.ok) {
        const pedidoAtualizado = await resposta.json();
        alert(`Pagamento do Pedido ID ${pedidoId} processado com sucesso! Status: ${pedidoAtualizado.Status}`);
      } else {
        throw new Error('Erro ao processar pagamento.');
      }
    } catch (error) {
      console.error('Erro ao fazer o pagamento:', error);
      alert('Erro ao processar o pagamento.');
    }
  };
  
  

  if (!pedido) {
    return <p>Dados do pedido não encontrados!</p>;
  }

  return (
    <div className="pagamento-container">
      <h1>Pagamento do Pedido</h1>
      <p><strong>Pedido ID:</strong> {pedidoId}</p>

      <div className="pagamento-detalhes">
        <h2>Detalhes do Pedido</h2>
        <ul>
          {pedido.itens.map((item, index) => (
            <li key={index}>
              <strong>{item.nomeProduto}</strong> - Quantidade: {item.quantidade} - Preço: R${item.preco.toFixed(2)}
            </li>
          ))}
        </ul>
        <p><strong>Valor Total:</strong> R${pedido.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0).toFixed(2)}</p>
      </div>

      <button onClick={() => handlePagamento(pedidoId, pedido.preco)}>Processar Pagamento</button>

    
    </div>
  );
}

export default Pagamento;
