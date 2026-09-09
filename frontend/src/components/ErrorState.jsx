export default function ErrorState({ message = 'Não foi possível carregar as informações.', onRetry }) {
  return (
    <div className="state-block" role="alert">
      <h3>Algo deu errado</h3>
      <p>{message} Tente novamente.</p>
      {onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
