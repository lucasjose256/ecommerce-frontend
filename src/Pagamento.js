import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './Pagamento.css';

function Pagamento() {
  const { pedidoId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(location.state?.pedido || null);
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    cartaoCredito: '',
  });
  const [erro, setErro] = useState('');

  // Busca o pedido caso ele não tenha vindo no estado
  useEffect(() => {
    if (!pedido) {
      fetch(`http://localhost:5053/pedidos/${pedidoId}`)
        .then((res) => {
          if (!res.ok) throw new Error('Pedido não encontrado');
          return res.json();
        })
        .then((data) => setPedido(data))
        .catch((err) => setErro(err.message));
    }
  }, [pedido, pedidoId]);

  // Atualiza os valores do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Lógica para processar o pagamento
  const handlePagamento = async () => {
    if (!pedido) {
      setErro('Pedido não encontrado!');
      return;
    }

    try {
      const dadosPagamento = {
        PedidoId: pedidoId,
        Status: 'Pendente',
        Valor: pedido.itens.reduce((total, item) => total + item.preco * item.quantidade, 0),
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
        alert(`Pagamento processado! Status: ${pedidoAtualizado.Status}`);
        navigate('/pedidos'); // Navegar para a página de pedidos
      } else {
        throw new Error('Erro ao processar pagamento.');
      }
    } catch (error) {
      console.error(error);
      setErro(error.message || 'Erro ao processar o pagamento.');
    }
  };

  if (erro) {
    return <p className="erro">Erro: {erro}</p>;
  }

  if (!pedido) {
    return <p>Carregando dados do pedido...</p>;
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
        <p><strong>Valor Total:</strong> R${pedido.itens.reduce((total, item) => total + item.preco * item.quantidade, 0).toFixed(2)}</p>
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
              required
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
              required
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
              required
            />
          </label>
        </form>
      </div>

      <button onClick={handlePagamento}>Processar Pagamento</button>
    </div>
  );
}

export default Pagamento;
