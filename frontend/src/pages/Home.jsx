import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../components/Seo';
import DishCard from '../components/DishCard';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';

export default function Home() {
  const fetchFeatured = useCallback(() => api.get('/menu').then((d) => d.items.filter((i) => i.featured && i.available).slice(0, 4)), []);
  const { data: featured, status, reload } = useFetch(fetchFeatured, []);

  return (
    <>
      <Seo
        title="BRASA — Restaurante contemporâneo na brasa | Recife"
        description="BRASA é um restaurante contemporâneo especializado em pratos preparados na brasa. Conheça o cardápio, reserve sua mesa e viva a experiência."
      />

      <section className="container hero">
        <div>
          <span className="eyebrow hero__eyebrow">Recife, Pernambuco</span>
          <h1>Tudo o que fazemos passa pela brasa.</h1>
          <p className="lede" style={{ marginTop: 24 }}>
            Cortes selecionados, peixes do dia e vegetais grelhados lentamente sobre carvão.
            Um cardápio curto, pensado para ser feito bem — não para ser feito de tudo.
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/reservas" className="btn btn-primary">Reservar mesa</Link>
            <Link to="/cardapio" className="btn btn-outline">Ver cardápio</Link>
          </div>
        </div>
        <div className="hero__meta">
          <p>Terça a domingo</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>18h às 23h</p>
          <p>Rua das Brasas, 120 — Recife</p>
        </div>
      </section>

      <hr className="hairline" />

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
            <h2>Destaques do cardápio</h2>
            <Link to="/cardapio" className="link-arrow">Ver cardápio completo</Link>
          </div>

          {status === 'loading' && <LoadingState label="Carregando destaques" />}
          {status === 'error' && <ErrorState message="Não foi possível carregar o cardápio." onRetry={reload} />}
          {status === 'empty' && <EmptyState title="Sem destaques no momento" message="Volte em breve para novidades do cardápio." />}
          {status === 'success' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
              {featured.map((item) => (
                <DishCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section section--dark">
        <div className="container grid-2">
          <div>
            <span className="eyebrow">Filosofia</span>
            <h2 style={{ marginTop: 16 }}>Poucos ingredientes. Muito tempo. Fogo de verdade.</h2>
          </div>
          <p style={{ opacity: 0.85 }}>
            Trabalhamos com carvão vegetal e fornos de brasa que aquecem antes mesmo de o
            restaurante abrir. Não usamos atalhos de forno elétrico ou fritura — cada prato do
            cardápio passa pela grelha ou pela brasa direta, com tempo de preparo respeitado até o fim.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container info-grid">
          <div className="info-block">
            <h3>Ambiente</h3>
            <p style={{ marginTop: 12 }}>Salão íntimo com mesas de madeira maciça e uma grelha aberta visível a partir do salão principal.</p>
          </div>
          <div className="info-block">
            <h3>Horário</h3>
            <p style={{ marginTop: 12 }}>Terça a domingo, das 18h às 23h. Última reserva às 23h.</p>
          </div>
          <div className="info-block">
            <h3>Localização</h3>
            <p style={{ marginTop: 12 }}>Rua das Brasas, 120 — Boa Viagem, Recife/PE.</p>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Sua mesa está esperando.</h2>
          <div style={{ marginTop: 32 }}>
            <Link to="/reservas" className="btn btn-primary">Fazer uma reserva</Link>
          </div>
        </div>
      </section>
    </>
  );
}
