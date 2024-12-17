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
      const item = event.data;
      console.log("Nova notificação recebida:", item);
      setNotificacoes((prev) => [...prev, item]);
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
      .then((response) => {
        setPedidos(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar os pedidos: ", error);
      });
  }, []);

  const calcularTotal = (itens) => {
    return itens.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const handlePagamento = (pedido) => {
    axios.post(`http://localhost:5164/pagamento/${pedido.pedidoId}`, {
      nome: pedido.nome,
      endereco: pedido.endereco,
      valor: pedido.itens.reduce((total, item) => total + item.preco * item.quantidade, 0),
    })
      .catch((error) => {
        console.error("Erro ao processar o pagamento: ", error);
      });
  };

  const handleExcluir = (pedidoId) => {
    axios.delete(`http://localhost:5053/pedidos/${pedidoId}`)
      .then(() => {
        // Remove o pedido excluído da lista de pedidos no estado
        setPedidos((prevPedidos) => prevPedidos.filter((pedido) => pedido.pedidoId !== pedidoId));
        console.log(`Pedido ${pedidoId} excluído com sucesso.`);
      })
      .catch((error) => {
        console.error("Erro ao excluir o pedido: ", error);
      });
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
              <p>{notificacao}</p>
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

            <div className="pedido-actions">
              {pedido.status === "criado" && (
                <>
                  <button 
                    className="btn-pagar" 
                    onClick={() => handlePagamento(pedido)}
                  >
                    Pagar
                  </button>
                  <button 
                    className="btn-excluir" 
                    onClick={() => handleExcluir(pedido.pedidoId)}
                  >
                    Excluir
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pedidos;
