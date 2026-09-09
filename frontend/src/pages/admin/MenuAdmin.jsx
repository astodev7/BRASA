import { useCallback, useEffect, useState } from 'react';
import { useFetch, useAsyncAction } from '../../hooks/useFetch';
import { api, ApiRequestError } from '../../services/api';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

function formatPrice(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

const emptyForm = {
  category_id: '', name: '', description: '', price: '', image_url: '',
  ingredients: '', allergens: '', available: true, featured: false, display_order: 0,
};

export default function MenuAdmin() {
  const fetchData = useCallback(
    () => Promise.all([api.get('/admin/menu'), api.get('/admin/categories')]).then(([m, c]) => ({
      items: m.items, categories: c.categories,
    })),
    []
  );
  const { data, status, reload } = useFetch(fetchData, []);
  const saveAction = useAsyncAction();

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  function openNew() {
    setForm({ ...emptyForm, category_id: data?.categories[0]?.id || '' });
    setFormError('');
    setEditing('new');
  }

  function openEdit(item) {
    setForm({
      category_id: item.category_id,
      name: item.name,
      description: item.description || '',
      price: item.price,
      image_url: item.image_url || '',
      ingredients: (item.ingredients || []).join(', '),
      allergens: (item.allergens || []).join(', '),
      available: item.available,
      featured: item.featured,
      display_order: item.display_order,
    });
    setFormError('');
    setEditing(item);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError('');
    const payload = {
      category_id: Number(form.category_id),
      name: form.name,
      description: form.description,
      price: Number(form.price),
      image_url: form.image_url,
      ingredients: form.ingredients.split(',').map((s) => s.trim()).filter(Boolean),
      allergens: form.allergens.split(',').map((s) => s.trim()).filter(Boolean),
      available: form.available,
      featured: form.featured,
      display_order: Number(form.display_order),
    };
    try {
      if (editing === 'new') {
        await saveAction.run(() => api.post('/admin/menu', payload));
      } else {
        await saveAction.run(() => api.put(`/admin/menu/${editing.id}`, payload));
      }
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.message : 'Não foi possível salvar o prato.');
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Excluir o prato "${item.name}"?`)) return;
    try {
      await api.delete(`/admin/menu/${item.id}`);
      reload();
    } catch (err) {
      alert(err.message || 'Não foi possível excluir o prato.');
    }
  }

  async function toggleAvailable(item) {
    try {
      await api.put(`/admin/menu/${item.id}`, { available: !item.available });
      reload();
    } catch (err) {
      alert(err.message || 'Não foi possível atualizar a disponibilidade.');
    }
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Cardápio</h1>
        <button type="button" className="admin-btn" onClick={openNew} disabled={status !== 'success'}>Novo prato</button>
      </div>

      {status === 'loading' && <LoadingState label="Carregando cardápio" />}
      {status === 'error' && <ErrorState message="Não foi possível carregar o cardápio." onRetry={reload} />}
      {status === 'success' && data.items.length === 0 && <EmptyState title="Nenhum prato cadastrado" />}

      {status === 'success' && data.items.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Prato</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Disponível</th>
                <th>Destaque</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.category_name}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <button type="button" className="admin-btn secondary" onClick={() => toggleAvailable(item)}>
                      {item.available ? 'Sim' : 'Não'}
                    </button>
                  </td>
                  <td>{item.featured ? 'Sim' : 'Não'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="admin-btn secondary" onClick={() => openEdit(item)}>Editar</button>
                    <button type="button" className="admin-btn danger" onClick={() => handleDelete(item)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-modal-backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <h2 style={{ fontSize: '1.2rem' }}>{editing === 'new' ? 'Novo prato' : `Editar: ${editing.name}`}</h2>
            <form className="form" style={{ marginTop: 24 }} onSubmit={handleSave}>
              {formError && <div className="status-banner error">{formError}</div>}

              <div className="field">
                <label htmlFor="item-category">Categoria</label>
                <select id="item-category" required value={form.category_id} onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}>
                  {data?.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="item-name">Nome</label>
                <input id="item-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="item-desc">Descrição</label>
                <textarea id="item-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-row two-col">
                <div className="field">
                  <label htmlFor="item-price">Preço (R$)</label>
                  <input id="item-price" type="number" step="0.01" min="0" required value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                </div>
                <div className="field">
                  <label htmlFor="item-image">URL da imagem</label>
                  <input id="item-image" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="item-ingredients">Ingredientes (separados por vírgula)</label>
                <input id="item-ingredients" value={form.ingredients} onChange={(e) => setForm((f) => ({ ...f, ingredients: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="item-allergens">Alergênicos (separados por vírgula)</label>
                <input id="item-allergens" value={form.allergens} onChange={(e) => setForm((f) => ({ ...f, allergens: e.target.value }))} />
              </div>
              <div className="form-row two-col">
                <div className="field">
                  <label htmlFor="item-order">Ordem de exibição</label>
                  <input id="item-order" type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
                </div>
                <div className="field">
                  <label htmlFor="item-available">Disponibilidade</label>
                  <select id="item-available" value={form.available ? 'true' : 'false'} onChange={(e) => setForm((f) => ({ ...f, available: e.target.value === 'true' }))}>
                    <option value="true">Disponível</option>
                    <option value="false">Indisponível</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="item-featured">
                  <input id="item-featured" type="checkbox" style={{ marginRight: 8, minHeight: 'auto' }}
                    checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
                  Destacar na home
                </label>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="submit" className="admin-btn" disabled={saveAction.status === 'loading'}>
                  {saveAction.status === 'loading' ? 'Salvando...' : 'Salvar'}
                </button>
                <button type="button" className="admin-btn secondary" onClick={() => setEditing(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
