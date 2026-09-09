import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Início', end: true },
  { to: '/cardapio', label: 'Cardápio' },
  { to: '/sobre', label: 'Sobre' },
  { to: '/contato', label: 'Contato' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <NavLink to="/" className="navbar__logo">BRASA</NavLink>

        <ul className="navbar__links">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={({ isActive }) => (isActive ? 'active' : '')}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <NavLink to="/reservas" className="btn btn-primary navbar__cta">Reservar mesa</NavLink>

        <button
          type="button"
          className="navbar__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="navbar__mobile" id="mobile-menu">
          <div className="container">
            <ul>
              {LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end={link.end} onClick={() => setOpen(false)}>
                    {link.label}
                  </NavLink>
                </li>
              ))}
              <li>
                <NavLink to="/reservas" className="btn btn-primary" onClick={() => setOpen(false)} style={{ width: '100%' }}>
                  Reservar mesa
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
