import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

export default function NotFound() {
  return (
    <section className="container section">
      <Seo title="Página não encontrada — BRASA" />
      <span className="eyebrow">404</span>
      <h1 style={{ marginTop: 12 }}>Essa página não existe.</h1>
      <p className="lede" style={{ marginTop: 16 }}>O endereço que você tentou acessar não foi encontrado.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 32 }}>Voltar para o início</Link>
    </section>
  );
}
