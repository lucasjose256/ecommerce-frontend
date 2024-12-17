import React from 'react';
import './NotificacaoCard.css';

function NotificacaoCard({ mensagem }) {
  return (
    <div className="notificacao-card">
      <p>{mensagem}</p>
    </div>
  );
}

export default NotificacaoCard;