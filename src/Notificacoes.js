import React, { useEffect, useState } from "react";

function Notificacoes() {
  const [mensagens, setMensagens] = useState([]);

  useEffect(() => {
    // Estabelece a conexão com o endpoint SSE do servidor
    const eventSource = new EventSource("http://localhost:5152/sse");

    // Quando uma nova mensagem é recebida, adiciona-a à lista de mensagens
    eventSource.onmessage = (event) => {
      setMensagens((prev) => [...prev, event.data]);
    };

    // Lida com erros de conexão
    eventSource.onerror = (error) => {
      console.error("Erro no SSE:", error);
      eventSource.close();  // Fechar a conexão se ocorrer um erro
    };

    // Limpeza da conexão quando o componente for desmontado
    return () => eventSource.close();
  }, []);

  return (
    <div>
      <h2>Notificações</h2>
      <ul>
        {mensagens.map((msg, idx) => (
          <li key={idx}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default Notificacoes;
