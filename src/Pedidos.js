import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pedidos.css';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5053/pedidos')
      .then(response => {
        setPedidos(response.data);
      })
      .catch(error => {
        console.error("Erro ao carregar os pedidos: ", error);
      });
  }, []);

  const calcularTotal = (itens) => {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const handlePagamento = (pedido) => {
    navigate(`/pagamento/${pedido.pedidoId}`, { state: { pedido } });
  };

  return (
    <div className="pedidos-container">
      <h1>Pedidos</h1>
      <div className="pedidos-list">
        {pedidos.map((pedido, index) => (
          <div key={index} className="pedido-card">
            <h2 className="pedido-title">Pedido ID: {pedido.pedidoId}</h2>
            <p><strong>Data:</strong> {new Date(pedido.dataPedido).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {pedido.status}</p>
            <div className="pedido-items">
              <ul>
                {pedido.itens.map((item, idx) => (
                  <li key={idx} className="item">
                    <span><strong>{item.nomeProduto}</strong> - Quantidade: {item.quantidade} - Preço: R${item.preco.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="pedido-total">
              <p><strong>Valor Total:</strong> R${calcularTotal(pedido.itens).toFixed(2)}</p>
            </div>

            {pedido.status === "criado" && (
              <button 
                className="btn-pagar" 
                onClick={() => handlePagamento(pedido)}
              >
                Pagar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pedidos;
