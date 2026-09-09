import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LINKS = [
  { to: '/admin/dashboard', label: 'Visão geral' },
  { to: '/admin/cardapio', label: 'Cardápio' },
  { to: '/admin/categorias', label: 'Categorias' },
  { to: '/admin/reservas', label: 'Reservas' },
  { to: '/admin/mensagens', label: 'Mensagens' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin/login');
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">BRASA · Admin</div>
        <nav>
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-sidebar__footer">
          <p>{user?.name}</p>
          <button type="button" className="admin-btn secondary" style={{ marginTop: 8 }} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
