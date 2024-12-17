import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Entrega.css';

function Entrega() {
  const [notasFiscais, setNotasFiscais] = useState([]);

  useEffect(() => {
    // Fetch notas fiscais from the backend
    axios.get('http://localhost:5053/notasfiscais')
      .then((response) => {
        setNotasFiscais(response.data);
      })
      .catch((error) => {
        console.error('Erro ao carregar notas fiscais:', error);
      });
  }, []);

  return (
    <div className="entrega-container">
      <h1>Notas Fiscais</h1>
      <div className="notas-list">
        {notasFiscais.length > 0 ? (
          notasFiscais.map((nota, index) => (
            <div key={index} className="nota-card">
              <h2>Nota Fiscal ID: {nota.id}</h2>
              <p><strong>Nome:</strong> {nota.nome}</p>
              <p><strong>Endereço:</strong> {nota.endereco}</p>
              <p><strong>CNPJ:</strong> {nota.cnpj}</p>
              <p><strong>Preço:</strong> R${nota.preco.toFixed(2)}</p>
            </div>
          ))
        ) : (
          <p>Não há notas fiscais disponíveis no momento.</p>
        )}
      </div>
    </div>
  );
}

export default Entrega;
