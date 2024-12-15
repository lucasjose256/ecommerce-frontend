// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ProdutoList from './ProdutoList';
import Carrinho from './Carrinho';
import Pedidos from './Pedidos';
import Pagamento from './Pagamento';
import Notificacoes from "./Notificacoes";

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Produtos</Link>
            </li>
            <li>
              <Link to="/carrinho">Carrinho</Link>
            </li>
            <li>
              <Link to="/pedidos">Pedidos</Link>
            </li>
            <li>
              <Link to="/pagamento">Pagamentos</Link>
            </li>
          </ul>
        </nav>
        
        <Routes>
          <Route path="/" element={<ProdutoList />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/" element={<Pedidos />} />
        <Route path="/pagamento/:pedidoId" element={<Pagamento />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
