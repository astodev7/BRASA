import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import RequireAdminAuth from './components/RequireAdminAuth';

import Home from './pages/Home';
import Menu from './pages/Menu';
import MenuItemDetail from './pages/MenuItemDetail';
import Reservations from './pages/Reservations';
import Contact from './pages/Contact';
import About from './pages/About';
import NotFound from './pages/NotFound';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import MenuAdmin from './pages/admin/MenuAdmin';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import ReservationsAdmin from './pages/admin/ReservationsAdmin';
import MessagesAdmin from './pages/admin/MessagesAdmin';

import RestaurantJsonLd from './components/RestaurantJsonLd';

export default function App() {
  return (
    <AuthProvider>
      <RestaurantJsonLd />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cardapio" element={<Menu />} />
          <Route path="/cardapio/:slug" element={<MenuItemDetail />} />
          <Route path="/reservas" element={<Reservations />} />
          <Route path="/contato" element={<Contact />} />
          <Route path="/sobre" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={(
            <RequireAdminAuth>
              <AdminLayout />
            </RequireAdminAuth>
          )}
        >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="cardapio" element={<MenuAdmin />} />
          <Route path="categorias" element={<CategoriesAdmin />} />
          <Route path="reservas" element={<ReservationsAdmin />} />
          <Route path="mensagens" element={<MessagesAdmin />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
