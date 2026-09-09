import { Link } from 'react-router-dom';

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function DishCard({ item }) {
  return (
    <Link to={`/cardapio/${item.slug}`} className="dish-card">
      <img
        className="dish-card__image"
        src={item.image_url || '/images/menu/placeholder.svg'}
        alt={item.name}
        loading="lazy"
      />
      <div className="dish-card__body">
        <h3 style={{ fontSize: '1.15rem' }}>{item.name}</h3>
        <p style={{ color: 'var(--color-ink-soft)', marginTop: 4 }}>{item.description}</p>
        <p style={{ fontFamily: 'var(--font-display)', marginTop: 8 }}>{formatPrice(item.price)}</p>
      </div>
    </Link>
  );
}
