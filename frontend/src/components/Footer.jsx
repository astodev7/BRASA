import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">BRASA</div>
            <p style={{ marginTop: 12, opacity: 0.8, maxWidth: '38ch' }}>
              Pratos preparados na brasa, em um espaço pensado para conversas longas e boa companhia.
            </p>
          </div>
          <div>
            <strong>Navegação</strong>
            <ul>
              <li><Link to="/cardapio">Cardápio</Link></li>
              <li><Link to="/reservas">Reservas</Link></li>
              <li><Link to="/sobre">Sobre o restaurante</Link></li>
              <li><Link to="/contato">Contato</Link></li>
            </ul>
          </div>
          <div>
            <strong>Visite-nos</strong>
            <ul>
              <li>Rua das Brasas, 120 — Recife, PE</li>
              <li>Ter. a Dom., 18h às 23h</li>
              <li><a href="tel:+558130000000">(81) 3000-0000</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} BRASA. Projeto de portfólio — dados fictícios.</span>
          <Link to="/admin">Acesso administrativo</Link>
        </div>
      </div>
    </footer>
  );
}
