export default function EmptyState({ title = 'Nada por aqui ainda', message }) {
  return (
    <div className="state-block">
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
