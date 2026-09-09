import { Link } from 'react-router-dom';

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export default function MenuRow({ item }) {
  return (
    <Link to={`/cardapio/${item.slug}`} className={`menu-row ${item.available ? '' : 'unavailable'}`}>
      <img
        className="menu-row__image"
        src={item.image_url || '/images/menu/placeholder.svg'}
        alt=""
        loading="lazy"
        width={96}
        height={96}
      />
      <div>
        <p className="menu-row__name">{item.name}</p>
        <p className="menu-row__desc">{item.description}</p>
        {!item.available && <span className="menu-row__tag">Indisponível no momento</span>}
        {item.featured && item.available && <span className="menu-row__tag">Destaque da casa</span>}
      </div>
      <span className="menu-row__price">{formatPrice(item.price)}</span>
    </Link>
  );
}
