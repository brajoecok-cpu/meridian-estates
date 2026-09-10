import { MetadataRoute } from 'next';
import propertiesData from '@/content/properties.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kings-realestate.com';

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/developments',
    '/neighborhoods',
    '/amenities',
    '/gallery',
    '/about',
    '/contact',
    '/legal',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  const propertyRoutes: MetadataRoute.Sitemap = propertiesData.properties.map((p) => ({
    url: `${baseUrl}/developments/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  return [...staticRoutes, ...propertyRoutes];
}
