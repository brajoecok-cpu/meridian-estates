import fs from 'fs';
import path from 'path';
import {
  Property,
  Neighborhood,
  Amenity,
  SiteSettings,
  GalleryItem,
  PressArticle,
  LeadershipMember,
  Testimonial,
  AboutContent,
} from '@/lib/types';
import fallbackPropertiesData from '@/content/properties.json';
import fallbackSiteContentData from '@/content/site-content.json';

const propertiesFilePath = path.join(process.cwd(), 'content', 'properties.json');
const siteContentFilePath = path.join(process.cwd(), 'content', 'site-content.json');

interface ContentData {
  properties: Property[];
  neighborhoods: Neighborhood[];
  amenities: Amenity[];
}

interface SiteContentData {
  siteSettings: SiteSettings;
  aboutContent: AboutContent;
  gallery: GalleryItem[];
  press: PressArticle[];
  leadership: LeadershipMember[];
  testimonials: Testimonial[];
}

export async function getContentData(): Promise<ContentData> {
  try {
    if (fs.existsSync(propertiesFilePath)) {
      const fileContent = await fs.promises.readFile(propertiesFilePath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading properties.json:', error);
  }
  return fallbackPropertiesData as ContentData;
}

export async function saveContentData(data: ContentData): Promise<void> {
  await fs.promises.writeFile(propertiesFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getSiteContentData(): Promise<SiteContentData> {
  try {
    if (fs.existsSync(siteContentFilePath)) {
      const fileContent = await fs.promises.readFile(siteContentFilePath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading site-content.json:', error);
  }
  return fallbackSiteContentData as SiteContentData;
}

export async function saveSiteContentData(data: SiteContentData): Promise<void> {
  await fs.promises.writeFile(siteContentFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Properties
export async function getProperties(): Promise<Property[]> {
  const data = await getContentData();
  return data.properties;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const data = await getContentData();
  const property = data.properties.find((p) => p.slug === slug);
  return property || null;
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const properties = await getProperties();
  return properties.slice(0, 3);
}

// Neighborhoods
export async function getNeighborhoods(): Promise<Neighborhood[]> {
  const data = await getContentData();
  return data.neighborhoods;
}

export async function getNeighborhoodBySlug(slug: string): Promise<Neighborhood | null> {
  const data = await getContentData();
  return data.neighborhoods.find((n) => n.slug === slug) || null;
}

// Amenities
export async function getAmenities(): Promise<Amenity[]> {
  const data = await getContentData();
  return data.amenities;
}

// Site Settings (Hero & Philosophy & Announcement Banner)
export async function getSiteSettings(): Promise<SiteSettings> {
  const data = await getSiteContentData();
  return data.siteSettings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await getSiteContentData();
  current.siteSettings = {
    ...current.siteSettings,
    ...settings,
    hero: { ...current.siteSettings.hero, ...(settings.hero || {}) },
    philosophy: { ...current.siteSettings.philosophy, ...(settings.philosophy || {}) },
    announcementBanner: { ...current.siteSettings.announcementBanner, ...(settings.announcementBanner || {}) },
    contact: { ...current.siteSettings.contact, ...(settings.contact || {}) } as any,
  };
  await saveSiteContentData(current);
  return current.siteSettings;
}

// Gallery
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const data = await getSiteContentData();
  return data.gallery;
}

export async function saveGalleryItems(items: GalleryItem[]): Promise<GalleryItem[]> {
  const current = await getSiteContentData();
  current.gallery = items;
  await saveSiteContentData(current);
  return current.gallery;
}

// Press
export async function getPressArticles(): Promise<PressArticle[]> {
  const data = await getSiteContentData();
  return data.press;
}

export async function savePressArticles(articles: PressArticle[]): Promise<PressArticle[]> {
  const current = await getSiteContentData();
  current.press = articles;
  await saveSiteContentData(current);
  return current.press;
}

// Leadership
export async function getLeadershipMembers(): Promise<LeadershipMember[]> {
  const data = await getSiteContentData();
  return data.leadership;
}

export async function saveLeadershipMembers(members: LeadershipMember[]): Promise<LeadershipMember[]> {
  const current = await getSiteContentData();
  current.leadership = members;
  await saveSiteContentData(current);
  return current.leadership;
}

// Testimonials
export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await getSiteContentData();
  return data.testimonials;
}

export async function saveTestimonials(testimonials: Testimonial[]): Promise<Testimonial[]> {
  const current = await getSiteContentData();
  current.testimonials = testimonials;
  await saveSiteContentData(current);
  return current.testimonials;
}

// About Content
export async function getAboutContent(): Promise<AboutContent> {
  const data = await getSiteContentData();
  return data.aboutContent;
}

export async function saveAboutContent(aboutContent: AboutContent): Promise<AboutContent> {
  const current = await getSiteContentData();
  current.aboutContent = aboutContent;
  await saveSiteContentData(current);
  return current.aboutContent;
}
