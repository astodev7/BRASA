import { useEffect } from 'react';

/**
 * Componente utilitario para atualizar title/meta description por pagina.
 * Uma solucao completa (SSR/SSG) traria SEO ainda melhor, mas esta abordagem
 * cobre os requisitos essenciais em uma SPA Vite/React.
 */
export default function Seo({ title, description }) {
  useEffect(() => {
    if (title) document.title = title;
    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}
