export type ServiceCategory = 
  | 'mineral-exploration'
  | 'resource-assessment'
  | 'environmental-regulatory'
  | 'geotechnical-engineering'
  | 'hydrogeology-water'
  | 'geospatial-mapping';

export type GalleryCategory = 
  | 'all'
  | 'geophysics'
  | 'geology'
  | 'groundwater'
  | 'drilling'
  | 'environmental'
  | 'instruments'
  | 'team';

export interface CompanyConfig {
  name: string;
  tagline: string;
  supportingStatements: string[];
  domain: string;
  legacyWebsite: string;
  facebookUrl: string;
  linkedinUrl: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  otherAddress?: string;
  logoUrl: string;
  founderName: string;
  founderTitle: string;
}

export interface ProjectRecord {
  id: number;
  description: string;
  client: string;
  status: string;
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  caption: string;
  category: GalleryCategory;
  alt: string;
  isHero: boolean;
  order: number;
  location?: string;
  date?: string;
  showOnHomepage?: boolean;
  showOnProjects?: boolean;
  showOnGallery?: boolean;
}

export interface ServiceItem {
  id: string;
  slug: ServiceCategory;
  numericCode: string;
  title: string;
  tagline: string;
  description: string;
  detailedScope: string[];
  methodsAndDeliverables: string[];
  targetSectors: string[];
  featuredImage: string;
  isPublished: boolean;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryKey: GalleryCategory;
  location: string;
  date: string;
  coverImage: string;
  summary: string;
  methodology: string;
  keyDeliverables: string[];
  galleryImages: string[];
  featured: boolean;
  status: 'Published' | 'Archived' | 'Draft';
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  credentials: string;
  experienceYears: string;
  affiliations: string[];
  bio: string;
  image: string;
  isPlaceholder: boolean;
  order: number;
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  isPublished: boolean;
}

export interface ConsultationEnquiry {
  id: string;
  referenceNumber: string;
  fullName: string;
  company?: string;
  email: string;
  phone?: string;
  serviceOfInterest: string;
  projectLocation?: string;
  subject: string;
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface ProjectVideo {
  id: string;
  title: string;
  subtitle: string;
  driveViewUrl: string;
  drivePreviewUrl: string;
  thumbnail: string;
  description: string;
  isVertical?: boolean;
  orientation?: 'vertical' | 'horizontal';
  showOnHomepage?: boolean;
  showOnGallery?: boolean;
}
