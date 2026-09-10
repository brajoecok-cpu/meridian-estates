export interface PropertySection {
  id: string;
  title: string;          // e.g. "The Living Volume", "Skyline Penthouse", "The Master Sanctuary"
  subtitle?: string;      // e.g. "Level 54 • Unrestricted Biscayne Bay Panoramas"
  description: string;
  videoMp4?: string;
  videoWebm?: string;
  playbackId?: string;    // Mux / Cloudflare Stream playback ID
  poster: string;
  specs?: { label: string; value: string }[];
}

export interface Property {
  slug: string;
  name: string;
  tagline: string;
  neighborhood: string;
  neighborhoodSlug?: string;
  unitType: string;        // e.g. "Penthouses & Sky Estates", "Waterfront Villas"
  priceFrom: number;       // e.g. 8500000
  completionDate: string;  // e.g. "Q4 2026", "Spring 2027"
  status?: 'Under Construction' | 'Pre-Construction' | 'Immediate Occupancy';
  architect?: string;
  interiorDesigner?: string;
  totalResidences?: number;
  heroVideoMp4?: string;
  heroPlaybackId?: string; // Mux / Cloudflare Stream playback ID
  heroPoster: string;
  galleryImages?: string[]; // Multiple high-res architectural gallery images
  shortDescription: string;
  overview: string;
  amenitiesHighlight?: string[];
  unitFeatures?: {
    bedrooms: string;
    bathrooms: string;
    kitchen: string;
    squareFootage: string;
  };
  sections: PropertySection[]; // Room-by-room architectural reveal stack
}

export interface Neighborhood {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroPoster: string;
  heroVideoMp4?: string;
  keyFeatures: string[];
  propertySlugs: string[];
}

export interface Amenity {
  id: string;
  title: string;
  category: 'Wellness & Spa' | 'Private Marina' | 'Culinary & Wine' | 'Sky Lounge' | 'Concierge';
  tagline: string;
  description: string;
  poster: string;
  videoMp4?: string;
  features: string[];
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone?: string;
  propertySlug?: string;
  propertyName?: string;
  timeframe?: string;
  budget?: string;
  message?: string;
  consent?: boolean;
}

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  propertyInterest: string;
  propertySlug?: string;
  budgetRange: string;
  timeframe?: string;
  acquisitionTimeframe?: string;
  message?: string;
  specialRequirements?: string;
  createdAt?: string;
  timestamp?: string;
  status: 'New' | 'Contacted' | 'In Review' | 'Showing Scheduled' | 'Under Contract' | 'Archived';
  priorityTier?: string;
  notes?: string;
  ndaAcknowledged?: boolean;
}

export interface SiteSettings {
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
    videoMp4: string;
    poster: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
  };
  philosophy: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    videoMp4: string;
    poster: string;
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    ctaText: string;
    ctaLink: string;
  };
  announcementBanner: {
    enabled: boolean;
    badge: string;
    text: string;
    linkText: string;
    linkUrl: string;
  };
  contact?: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    workingHours: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string; // 'Penthouses' | 'Living Volumes' | 'Waterfront' | 'Night Views' | 'Architecture'
  image: string;
  caption?: string;
  featured?: boolean;
}

export interface PressArticle {
  id: string;
  title: string;
  publication: string;
  date: string;
  summary: string;
  link?: string;
  image?: string;
  featured?: boolean;
}

export interface LeadershipMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  order?: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  titleOrResidence: string;
  category?: string;
}

export interface DeliveredProject {
  id: string;
  title: string;
  neighborhood: string;
  architect: string;
  units: string;
  valuation: string;
  status: string;
  image: string;
  description: string;
  slug: string;
}

export interface AboutTenet {
  id: string;
  iconName: string; // e.g., 'Landmark', 'Shield', 'Award', 'Diamond'
  title: string;
  desc: string;
}

export interface AboutContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroVideoMp4: string;
  heroPoster: string;

  philosophyTitle: string;
  philosophySubtitle: string;
  philosophyParagraph1: string;
  philosophyParagraph2: string;
  philosophyImage: string;
  philosophyStat1Value: string;
  philosophyStat1Label: string;
  philosophyStat2Value: string;
  philosophyStat2Label: string;

  portfolioTitle: string;
  portfolioSubtitle: string;
  portfolioDescription: string;
  deliveredProjects: DeliveredProject[];

  tenetsTitle: string;
  tenetsSubtitle: string;
  tenets: AboutTenet[];
  
  ctaTitle: string;
  ctaDescription: string;
}
