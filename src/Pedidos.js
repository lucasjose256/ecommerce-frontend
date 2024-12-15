import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Pedidos.css';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [notificacoes, setNotificacoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const eventSource = new EventSource('http://localhost:5152/sse');

    eventSource.onmessage = function (event) {
      const item = event.data; // Pode ser string ou JSON, dependendo do formato enviado
      console.log("Nova notificação recebida:", item);
      setNotificacoes(prev => [...prev, item]);
    };

    eventSource.onerror = (error) => {
      console.error("Erro na conexão SSE:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

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

      {/* Exibindo as notificações */}
      <div className="notificacoes-container">
        <h2>Notificações</h2>
        <ul>
          {notificacoes.map((notificacao, idx) => (
            <li key={idx} className="notificacao-item">
              <p>{notificacao}</p> {/* Exibindo a notificação */}
            </li>
          ))}
        </ul>
      </div>

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
