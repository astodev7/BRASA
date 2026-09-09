const LABELS = {
  pending: 'Pendente',
  confirmed: 'Confirmada',
  cancelled: 'Cancelada',
  completed: 'Concluída',
  new: 'Nova',
  read: 'Lida',
  replied: 'Respondida',
  archived: 'Arquivada',
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${status}`}>{LABELS[status] || status}</span>;
}
