import { Property } from '@/lib/types';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kings-realestate.com';

export function generateRealEstateListingJsonLd(property: Property) {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.name,
    description: property.shortDescription,
    url: `${BASE_URL}/developments/${property.slug}`,
    image: [
      `${BASE_URL}${property.heroPoster}`,
      ...property.sections.map((s) => `${BASE_URL}${s.poster}`),
    ],
    offers: {
      '@type': 'Offer',
      price: property.priceFrom,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-01-01',
    },
    about: {
      '@type': 'Place',
      name: property.name,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Miami',
        addressRegion: 'FL',
        addressCountry: 'US',
        postalCode: '33131',
        streetAddress: property.neighborhood,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 25.7617,
        longitude: -80.1918,
      },
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Kings Real Estate Development LLC',
    url: BASE_URL,
    logo: `${BASE_URL}/images/im1.jpg`,
    description:
      'Premier Miami luxury property developer specializing in trophy waterfront villas, sky penthouses, and private island compounds.',
    telephone: '+233 200316267',
    email: 'concierge@kings-realestate.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '1421 Brickell Avenue, 48th Floor',
      addressLocality: 'Miami',
      addressRegion: 'FL',
      postalCode: '33131',
      addressCountry: 'US',
    },
    priceRange: '$$$$$',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ],
        opens: '09:00',
        closes: '19:00',
      },
    ],
  };
}
