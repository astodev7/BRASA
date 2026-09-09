export default function LoadingState({ label = 'Carregando...' }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <div className="skeleton" style={{ height: 18, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 18, width: '85%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 18, width: '40%' }} />
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
