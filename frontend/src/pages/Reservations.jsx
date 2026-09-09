import { useState } from 'react';
import Seo from '../components/Seo';
import { api, ApiRequestError } from '../services/api';

const initialForm = {
  customer_name: '',
  email: '',
  phone: '',
  reservation_date: '',
  reservation_time: '',
  guests: 2,
  notes: '',
  website: '', // honeypot
};

export default function Reservations() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // idle | loading | success | error
  const [submitError, setSubmitError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'guests' ? Number(value) : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitStatus === 'loading') return; // previne multiplos envios

    setSubmitStatus('loading');
    setSubmitError('');
    setFieldErrors({});

    try {
      await api.post('/reservations', form);
      setSubmitStatus('success');
      setForm(initialForm);
    } catch (err) {
      setSubmitStatus('error');
      if (err instanceof ApiRequestError && err.code === 'VALIDATION_ERROR' && err.details) {
        const flattened = {};
        Object.entries(err.details).forEach(([key, messages]) => {
          flattened[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setFieldErrors(flattened);
        setSubmitError('Verifique os campos destacados abaixo.');
      } else {
        setSubmitError(err.message || 'Não foi possível enviar sua reserva. Tente novamente.');
      }
    }
  }

  if (submitStatus === 'success') {
    return (
      <section className="container section--tight">
        <div className="status-banner success" role="status">
          <div>
            <h3>Recebemos sua solicitação de reserva.</h3>
            <p style={{ marginTop: 8 }}>
              Em breve confirmaremos por e-mail. Se precisar alterar algo, entre em contato pelo telefone (81) 3000-0000.
            </p>
          </div>
        </div>
        <button type="button" className="btn btn-outline" style={{ marginTop: 24 }} onClick={() => setSubmitStatus('idle')}>
          Fazer outra reserva
        </button>
      </section>
    );
  }

  return (
    <>
      <Seo title="Reservas — BRASA" description="Solicite sua reserva no restaurante BRASA. Responderemos por e-mail em breve." />

      <section className="container section--tight">
        <span className="eyebrow">Reservas</span>
        <h1 style={{ marginTop: 12 }}>Reserve sua mesa</h1>
        <p className="lede" style={{ marginTop: 16 }}>
          Preencha os dados abaixo. Sua reserva ficará pendente até a confirmação do restaurante.
        </p>

        <form className="form" style={{ marginTop: 40 }} onSubmit={handleSubmit} noValidate>
          <div className="honeypot-field" aria-hidden="true">
            <label htmlFor="website">Não preencha este campo</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
          </div>

          {submitStatus === 'error' && (
            <div className="status-banner error" role="alert">
              {submitError}
            </div>
          )}

          <div className="field">
            <label htmlFor="customer_name">Nome completo</label>
            <input
              id="customer_name" name="customer_name" type="text" required
              value={form.customer_name} onChange={handleChange}
              aria-invalid={!!fieldErrors.customer_name}
              aria-describedby={fieldErrors.customer_name ? 'err-name' : undefined}
            />
            {fieldErrors.customer_name && <span id="err-name" className="field-error">{fieldErrors.customer_name}</span>}
          </div>

          <div className="form-row two-col">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email" name="email" type="email" required
                value={form.email} onChange={handleChange}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'err-email' : undefined}
              />
              {fieldErrors.email && <span id="err-email" className="field-error">{fieldErrors.email}</span>}
            </div>
            <div className="field">
              <label htmlFor="phone">Telefone</label>
              <input
                id="phone" name="phone" type="tel" required placeholder="(81) 90000-0000"
                value={form.phone} onChange={handleChange}
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? 'err-phone' : undefined}
              />
              {fieldErrors.phone && <span id="err-phone" className="field-error">{fieldErrors.phone}</span>}
            </div>
          </div>

          <div className="form-row two-col">
            <div className="field">
              <label htmlFor="reservation_date">Data</label>
              <input
                id="reservation_date" name="reservation_date" type="date" required
                value={form.reservation_date} onChange={handleChange}
                aria-invalid={!!fieldErrors.reservation_date}
                aria-describedby={fieldErrors.reservation_date ? 'err-date' : undefined}
              />
              {fieldErrors.reservation_date && <span id="err-date" className="field-error">{fieldErrors.reservation_date}</span>}
            </div>
            <div className="field">
              <label htmlFor="reservation_time">Horário</label>
              <input
                id="reservation_time" name="reservation_time" type="time" required min="18:00" max="23:00"
                value={form.reservation_time} onChange={handleChange}
                aria-invalid={!!fieldErrors.reservation_time}
                aria-describedby={fieldErrors.reservation_time ? 'err-time' : undefined}
              />
              {fieldErrors.reservation_time && <span id="err-time" className="field-error">{fieldErrors.reservation_time}</span>}
              <span style={{ fontSize: '0.8rem', color: 'var(--color-ink-soft)' }}>Funcionamos das 18h às 23h.</span>
            </div>
          </div>

          <div className="field" style={{ maxWidth: 160 }}>
            <label htmlFor="guests">Número de pessoas</label>
            <input
              id="guests" name="guests" type="number" min={1} max={20} required
              value={form.guests} onChange={handleChange}
              aria-invalid={!!fieldErrors.guests}
              aria-describedby={fieldErrors.guests ? 'err-guests' : undefined}
            />
            {fieldErrors.guests && <span id="err-guests" className="field-error">{fieldErrors.guests}</span>}
          </div>

          <div className="field">
            <label htmlFor="notes">Observações (opcional)</label>
            <textarea id="notes" name="notes" value={form.notes} onChange={handleChange} maxLength={500} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitStatus === 'loading'}>
            {submitStatus === 'loading' ? 'Enviando...' : 'Solicitar reserva'}
          </button>
        </form>
      </section>
    </>
  );
}
