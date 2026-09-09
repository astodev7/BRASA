import { useCallback, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../services/api';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

const STATUSES = ['new', 'read', 'replied', 'archived'];

export default function MessagesAdmin() {
  const [filter, setFilter] = useState('');
  const fetchMessages = useCallback(
    () => api.get(`/admin/messages${filter ? `?status=${filter}` : ''}`).then((d) => d.messages),
    [filter]
  );
  const { data: messages, status, reload } = useFetch(fetchMessages, [filter]);

  async function handleStatusChange(message, newStatus) {
    try {
      await api.patch(`/admin/messages/${message.id}/status`, { status: newStatus });
      reload();
    } catch (err) {
      alert(err.message || 'Não foi possível atualizar o status da mensagem.');
    }
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Mensagens</h1>
      </div>

      <div className="admin-toolbar">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filtrar por status">
          <option value="">Todos os status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {status === 'loading' && <LoadingState label="Carregando mensagens" />}
      {status === 'error' && <ErrorState message="Não foi possível carregar as mensagens." onRetry={reload} />}
      {status === 'success' && messages.length === 0 && <EmptyState title="Nenhuma mensagem encontrada" />}

      {status === 'success' && messages.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Remetente</th>
                <th>Assunto</th>
                <th>Mensagem</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}<br />{m.email}</td>
                  <td>{m.subject}</td>
                  <td style={{ whiteSpace: 'normal', maxWidth: 280 }}>{m.message}</td>
                  <td><StatusBadge status={m.status} /></td>
                  <td>
                    <select value={m.status} onChange={(e) => handleStatusChange(m, e.target.value)} aria-label={`Alterar status da mensagem de ${m.name}`}>
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
