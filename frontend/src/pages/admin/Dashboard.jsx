import { useCallback } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';

export default function Dashboard() {
  const fetchOverview = useCallback(() => api.get('/admin/dashboard'), []);
  const { data, status, reload } = useFetch(fetchOverview, []);

  return (
    <div>
      <div className="admin-topbar">
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Visão geral</h1>
      </div>

      {status === 'loading' && <LoadingState label="Carregando indicadores" />}
      {status === 'error' && <ErrorState message="Não foi possível carregar o painel." onRetry={reload} />}

      {status === 'success' && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-card__value">{data.reservations.pending}</span>
            <span className="stat-card__label">Reservas pendentes</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{data.reservations.confirmed}</span>
            <span className="stat-card__label">Reservas confirmadas</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{data.messages.new}</span>
            <span className="stat-card__label">Mensagens novas</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{data.menu.available}</span>
            <span className="stat-card__label">Pratos disponíveis</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{data.menu.featured}</span>
            <span className="stat-card__label">Pratos em destaque</span>
          </div>
        </div>
      )}
    </div>
  );
}
