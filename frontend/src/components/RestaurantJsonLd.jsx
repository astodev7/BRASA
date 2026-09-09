import { useEffect } from 'react';

/**
 * Dados fictícios, porém consistentes com o restante do site (endereço,
 * horário e telefone usados no rodapé e nas páginas de contato).
 */
const restaurantData = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: 'BRASA',
  servesCuisine: 'Brasileira contemporânea',
  priceRange: 'R$60 - R$150',
  telephone: '+55-81-3000-0000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Rua das Brasas, 120',
    addressLocality: 'Recife',
    addressRegion: 'PE',
    postalCode: '51020-000',
    addressCountry: 'BR',
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '18:00',
      closes: '23:00',
    },
  ],
  image: 'https://www.brasa.example/og-image.jpg',
  url: 'https://www.brasa.example/',
  sameAs: ['https://instagram.com/brasa.exemplo'],
};

export default function RestaurantJsonLd() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(restaurantData);
    script.id = 'restaurant-jsonld';
    document.head.appendChild(script);
    return () => {
      document.getElementById('restaurant-jsonld')?.remove();
    };
  }, []);

  return null;
}
