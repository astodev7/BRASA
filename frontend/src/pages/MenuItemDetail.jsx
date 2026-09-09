import { useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../components/Seo';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function MenuItemDetail() {
  const { slug } = useParams();
  const fetchItem = useCallback(() => api.get(`/menu/${slug}`).then((d) => d.item), [slug]);
  const { data: item, status, error, reload } = useFetch(fetchItem, [slug]);

  if (status === 'loading') return <div className="container section--tight"><LoadingState label="Carregando prato" /></div>;

  if (status === 'error') {
    const message = error?.status === 404 ? 'Este prato não foi encontrado.' : 'Não foi possível carregar este prato.';
    return (
      <div className="container section--tight">
        <ErrorState message={message} onRetry={error?.status === 404 ? undefined : reload} />
        <Link to="/cardapio" className="link-arrow">Voltar ao cardápio</Link>
      </div>
    );
  }

  return (
    <>
      <Seo title={`${item.name} — BRASA`} description={item.description} />
      <section className="container section--tight grid-2">
        <img
          src={item.image_url || '/images/menu/placeholder.svg'}
          alt={item.name}
          style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', background: 'var(--color-line)' }}
        />
        <div>
          <span className="eyebrow">{item.category_name}</span>
          <h1 style={{ marginTop: 12 }}>{item.name}</h1>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginTop: 16 }}>{formatPrice(item.price)}</p>
          <p className="lede" style={{ marginTop: 16 }}>{item.description}</p>

          {!item.available && (
            <p style={{ marginTop: 16, color: 'var(--color-error)' }}>Este prato está temporariamente indisponível.</p>
          )}

          {item.ingredients?.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ fontSize: '1rem' }}>Ingredientes</h3>
              <p style={{ marginTop: 8, color: 'var(--color-ink-soft)' }}>{item.ingredients.join(', ')}</p>
            </div>
          )}

          {item.allergens?.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: '1rem' }}>Alergênicos</h3>
              <p style={{ marginTop: 8, color: 'var(--color-ink-soft)' }}>{item.allergens.join(', ')}</p>
            </div>
          )}

          <div style={{ marginTop: 32, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/reservas" className="btn btn-primary">Reservar mesa</Link>
            <Link to="/cardapio" className="btn btn-outline">Voltar ao cardápio</Link>
          </div>
        </div>
      </section>
    </>
  );
}
