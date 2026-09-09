import { useCallback, useMemo, useState } from 'react';
import Seo from '../components/Seo';
import MenuRow from '../components/MenuRow';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { useFetch } from '../hooks/useFetch';
import { api } from '../services/api';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('todas');
  const [search, setSearch] = useState('');

  const fetchMenu = useCallback(
    () => Promise.all([api.get('/menu'), api.get('/menu/categories')]).then(([m, c]) => ({
      items: m.items,
      categories: c.categories,
    })),
    []
  );

  const { data, status, reload } = useFetch(fetchMenu, []);

  const filteredItems = useMemo(() => {
    if (!data) return [];
    let items = data.items;
    if (activeCategory !== 'todas') {
      items = items.filter((i) => i.category_slug === activeCategory);
    }
    if (search.trim()) {
      const term = search.trim().toLowerCase();
      items = items.filter(
        (i) => i.name.toLowerCase().includes(term) || (i.description || '').toLowerCase().includes(term)
      );
    }
    return items;
  }, [data, activeCategory, search]);

  return (
    <>
      <Seo
        title="Cardápio — BRASA"
        description="Conheça o cardápio do BRASA: entradas, carnes, peixes, acompanhamentos, sobremesas e drinks preparados na brasa."
      />

      <section className="container section--tight">
        <span className="eyebrow">Cardápio</span>
        <h1 style={{ marginTop: 12 }}>O que sai da nossa brasa</h1>

        {status === 'loading' && <LoadingState label="Carregando cardápio" />}
        {status === 'error' && <ErrorState message="Não foi possível carregar o cardápio." onRetry={reload} />}

        {status === 'success' && (
          <>
            <div style={{ marginTop: 40 }}>
              <label htmlFor="menu-search" className="visually-hidden">Buscar prato</label>
              <input
                id="menu-search"
                type="search"
                placeholder="Buscar prato, ingrediente..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%', maxWidth: 420, padding: '0.85rem 1rem', border: '1px solid var(--color-ink-soft)',
                  background: 'var(--color-off-white)', fontSize: '1rem', minHeight: 48,
                }}
              />
            </div>

            <div className="category-filter" style={{ marginTop: 32 }} role="tablist" aria-label="Filtrar por categoria">
              <button type="button" className={activeCategory === 'todas' ? 'active' : ''} onClick={() => setActiveCategory('todas')}>
                Todas
              </button>
              {data.categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={activeCategory === c.slug ? 'active' : ''}
                  onClick={() => setActiveCategory(c.slug)}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <EmptyState title="Nenhum prato encontrado" message="Tente outra categoria ou termo de busca." />
            ) : (
              <div className="menu-list" style={{ marginTop: 8 }}>
                {filteredItems.map((item) => (
                  <MenuRow key={item.id} item={item} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
