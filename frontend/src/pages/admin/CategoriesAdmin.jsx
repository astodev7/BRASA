import { useCallback, useState } from 'react';
import { useFetch, useAsyncAction } from '../../hooks/useFetch';
import { api, ApiRequestError } from '../../services/api';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const emptyForm = { name: '', description: '', display_order: 0, active: true };

export default function CategoriesAdmin() {
  const fetchCategories = useCallback(() => api.get('/admin/categories').then((d) => d.categories), []);
  const { data: categories, status, reload } = useFetch(fetchCategories, []);
  const saveAction = useAsyncAction();

  const [editing, setEditing] = useState(null); // null | 'new' | category object
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  function openNew() {
    setForm(emptyForm);
    setFormError('');
    setEditing('new');
  }

  function openEdit(category) {
    setForm({
      name: category.name,
      description: category.description || '',
      display_order: category.display_order,
      active: category.active,
    });
    setFormError('');
    setEditing(category);
  }

  async function handleSave(e) {
    e.preventDefault();
    setFormError('');
    try {
      const payload = { ...form, display_order: Number(form.display_order) };
      if (editing === 'new') {
        await saveAction.run(() => api.post('/admin/categories', payload));
      } else {
        await saveAction.run(() => api.put(`/admin/categories/${editing.id}`, payload));
      }
      setEditing(null);
      reload();
    } catch (err) {
      setFormError(err instanceof ApiRequestError ? err.message : 'Não foi possível salvar a categoria.');
    }
  }

  async function handleDelete(category) {
    if (!window.confirm(`Excluir a categoria "${category.name}"?`)) return;
    try {
      await api.delete(`/admin/categories/${category.id}`);
      reload();
    } catch (err) {
      alert(err.message || 'Não foi possível excluir a categoria.');
    }
  }

  return (
    <div>
      <div className="admin-topbar">
        <h1 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Categorias</h1>
        <button type="button" className="admin-btn" onClick={openNew}>Nova categoria</button>
      </div>

      {status === 'loading' && <LoadingState label="Carregando categorias" />}
      {status === 'error' && <ErrorState message="Não foi possível carregar as categorias." onRetry={reload} />}
      {status === 'success' && categories.length === 0 && <EmptyState title="Nenhuma categoria cadastrada" />}

      {status === 'success' && categories.length > 0 && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Ordem</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.display_order}</td>
                  <td>{c.active ? 'Ativa' : 'Inativa'}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="admin-btn secondary" onClick={() => openEdit(c)}>Editar</button>
                    <button type="button" className="admin-btn danger" onClick={() => handleDelete(c)}>Excluir</button>
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
            <h2 style={{ fontSize: '1.2rem' }}>{editing === 'new' ? 'Nova categoria' : `Editar: ${editing.name}`}</h2>
            <form className="form" style={{ marginTop: 24 }} onSubmit={handleSave}>
              {formError && <div className="status-banner error">{formError}</div>}
              <div className="field">
                <label htmlFor="cat-name">Nome</label>
                <input id="cat-name" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="cat-desc">Descrição</label>
                <textarea id="cat-desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-row two-col">
                <div className="field">
                  <label htmlFor="cat-order">Ordem de exibição</label>
                  <input id="cat-order" type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
                </div>
                <div className="field">
                  <label htmlFor="cat-active">Status</label>
                  <select id="cat-active" value={form.active ? 'true' : 'false'} onChange={(e) => setForm((f) => ({ ...f, active: e.target.value === 'true' }))}>
                    <option value="true">Ativa</option>
                    <option value="false">Inativa</option>
                  </select>
                </div>
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
