import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function PublicLayout() {
  return (
    <>
      <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
      <Navbar />
      <main id="main-content" className="page-fade-in">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
