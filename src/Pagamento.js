import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import './Pagamento.css';

function Pagamento() {
  const { pedidoId } = useParams();
  const location = useLocation();
  const { pedido } = location.state || {};

  // State para os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cartaoCredito: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePagamento = async () => {
    try {
      const dadosPagamento = {
        PedidoId: pedidoId,
        Status: 'Pendente',
        Valor: pedido.itens.reduce((total, item) => total + (item.preco * item.quantidade), 0),
        Nome: formData.nome,
        Endereco: formData.endereco,
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
        alert(`Pagamento do Pedido ID ${pedidoId} processado! Status: ${pedidoAtualizado.Status}`);
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

      <div className="pagamento-formulario">
        <h3>Detalhes do Pagamento</h3>
        <form>
          <label>
            Nome:
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Endereço:
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleInputChange}
            />
          </label>
          <br />
          <label>
            Cartão de Crédito:
            <input
              type="text"
              name="cartaoCredito"
              value={formData.cartaoCredito}
              onChange={handleInputChange}
            />
          </label>
        </form>
      </div>

      <button onClick={handlePagamento}>Processar Pagamento</button>
    </div>
  );
}

export default Pagamento;