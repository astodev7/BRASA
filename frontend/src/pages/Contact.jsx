import { useState } from 'react';
import Seo from '../components/Seo';
import { api, ApiRequestError } from '../services/api';

const initialForm = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle');
  const [submitError, setSubmitError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitStatus === 'loading') return;

    setSubmitStatus('loading');
    setSubmitError('');
    setFieldErrors({});

    try {
      await api.post('/contact', form);
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
        setSubmitError(err.message || 'Não foi possível enviar sua mensagem. Tente novamente.');
      }
    }
  }

  return (
    <>
      <Seo title="Contato — BRASA" description="Fale com o restaurante BRASA. Envie uma mensagem e responderemos em breve." />

      <section className="container section--tight grid-2">
        <div>
          <span className="eyebrow">Contato</span>
          <h1 style={{ marginTop: 12 }}>Fale com a gente</h1>
          <p className="lede" style={{ marginTop: 16 }}>
            Dúvidas sobre eventos privados, grupos grandes ou parcerias? Escreva para nós.
          </p>
          <div style={{ marginTop: 32 }}>
            <p><strong>Endereço</strong><br />Rua das Brasas, 120 — Recife, PE</p>
            <p style={{ marginTop: 16 }}><strong>Telefone</strong><br /><a href="tel:+558130000000">(81) 3000-0000</a></p>
            <p style={{ marginTop: 16 }}><strong>Horário</strong><br />Terça a domingo, 18h às 23h</p>
          </div>
        </div>

        <div>
          {submitStatus === 'success' ? (
            <div className="status-banner success" role="status">
              <div>
                <h3>Mensagem enviada com sucesso.</h3>
                <p style={{ marginTop: 8 }}>Responderemos em breve pelo e-mail informado.</p>
              </div>
            </div>
          ) : (
            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="honeypot-field" aria-hidden="true">
                <label htmlFor="website">Não preencha este campo</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
              </div>

              {submitStatus === 'error' && (
                <div className="status-banner error" role="alert">{submitError}</div>
              )}

              <div className="field">
                <label htmlFor="name">Nome</label>
                <input id="name" name="name" type="text" required value={form.name} onChange={handleChange}
                  aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? 'err-name' : undefined} />
                {fieldErrors.name && <span id="err-name" className="field-error">{fieldErrors.name}</span>}
              </div>

              <div className="form-row two-col">
                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                    aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'err-email' : undefined} />
                  {fieldErrors.email && <span id="err-email" className="field-error">{fieldErrors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="phone">Telefone (opcional)</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="field">
                <label htmlFor="subject">Assunto</label>
                <input id="subject" name="subject" type="text" required value={form.subject} onChange={handleChange}
                  aria-invalid={!!fieldErrors.subject} aria-describedby={fieldErrors.subject ? 'err-subject' : undefined} />
                {fieldErrors.subject && <span id="err-subject" className="field-error">{fieldErrors.subject}</span>}
              </div>

              <div className="field">
                <label htmlFor="message">Mensagem</label>
                <textarea id="message" name="message" required value={form.message} onChange={handleChange} maxLength={2000}
                  aria-invalid={!!fieldErrors.message} aria-describedby={fieldErrors.message ? 'err-message' : undefined} />
                {fieldErrors.message && <span id="err-message" className="field-error">{fieldErrors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitStatus === 'loading'}>
                {submitStatus === 'loading' ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
