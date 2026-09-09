import { useCallback, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'];

function formatDate(dateStr, timeStr) {
  const date = new Date(`${dateStr}T00:00:00`);
  return `${date.toLocaleDateString('pt-BR')} às ${timeStr?.slice(0, 5)}`;
}

export default function ReservationsAdmin() {
  const [filter, setFilter] = useState('');
  const fetchReservations = useCallback(
    () => api.get(`/admin/reservations${filter ? `?status=${filter}` : ''}`).then((d) => d.reservations),
    [filter]
  );
  const { data: reservations, status, reload } = useFetch(fetchReservations, [filter]);

  async function handleStatusChange(reservation, newStatus) {
    try {
      await api.patch(`/admin/reservations/${reservation.id}/status`, { status: newStatus });
      reload();
    } catch (err) {
      alert(err.message || 'Não foi possível atualizar o status da reserva.');
    }
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Reservas</h1>
      </div>

      <div className="admin-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {status === 'loading' && <LoadingState label="Carregando reservas" />}
      {status === 'error' && <ErrorState message="Não foi possível carregar as reservas." onRetry={reload} />}
      {status === 'success' && reservations.length === 0 && <EmptyState title="Nenhuma reserva encontrada" />}

      {status === 'success' && reservations.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Contato</th>
                <th>Data / Horário</th>
                <th>Pessoas</th>
                <th>Observações</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.customer_name}</td>
                  <td>{r.email}<br />{r.phone}</td>
                  <td>{formatDate(r.reservation_date, r.reservation_time)}</td>
                  <td>{r.guests}</td>
                  <td style={{ whiteSpace: 'normal', maxWidth: 220 }}>{r.notes || '—'}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>
                    <select value={r.status} onChange={(e) => handleStatusChange(r, e.target.value)} aria-label={`Alterar status da reserva de ${r.customer_name}`}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
