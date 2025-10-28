/**
 * Payload CMS API Client
 * Fetches content from the Payload CMS API
 */

// Get CMS URL from environment or use default
const CMS_URL = import.meta.env.PUBLIC_CMS_URL || 'https://astro-portfolio-cms-delta.vercel.app';

interface CMSResponse<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

/**
 * Generic fetch function for Payload CMS collections
 */
async function fetchCollection<T>(
  collection: string,
  options?: {
    limit?: number;
    sort?: string;
    where?: Record<string, any>;
    locale?: string;
  }
): Promise<T[]> {
  try {
    const params = new URLSearchParams();

    if (options?.limit) {
      params.append('limit', options.limit.toString());
    }

    if (options?.sort) {
      params.append('sort', options.sort);
    }

    if (options?.where) {
      params.append('where', JSON.stringify(options.where));
    }

    if (options?.locale) {
      params.append('locale', options.locale);
    }

    const url = `${CMS_URL}/api/${collection}?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${collection}: ${response.statusText}`);
    }

    const data: CMSResponse<T> = await response.json();
    return data.docs;
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    return [];
  }
}

/**
 * Services Collection
 */
export interface Service {
  id: string;
  title1: string;
  title2: string;
  description: string;
  serviceTags: { tag: string; id?: string }[];
  techTags: { tech: string; id?: string }[];
  exampleProject?: string;
  images?: {
    image: {
      url: string;
      alt?: string;
    };
    id?: string;
  }[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export async function getServices(locale: string = 'en'): Promise<Service[]> {
  return fetchCollection<Service>('services', {
    where: { status: { equals: 'published' } },
    sort: 'createdAt',
    locale,
  });
}

/**
 * Home FAQs Collection
 */
export interface HomeFAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export async function getHomeFAQs(locale: string = 'en'): Promise<HomeFAQ[]> {
  return fetchCollection<HomeFAQ>('home-faqs', {
    where: { status: { equals: 'published' } },
    sort: 'order',
    locale,
  });
}

/**
 * Projects Collection
 */
export interface Project {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  // Homepage fields
  homepageTitle1?: string;
  homepageTitle2?: string;
  homepageDescription?: string;
  homepageTags?: { tag: string; id?: string }[];
  homepageImages?: {
    image: {
      url: string;
      alt?: string;
    };
    id?: string;
  }[];
  // Case study fields (for future use)
  caseStudyHeroImage?: {
    url: string;
    alt?: string;
  };
  caseStudyDescription?: string;
  // ... other case study fields
  createdAt: string;
  updatedAt: string;
}

export async function getProjects(featuredOnly = false, locale: string = 'en'): Promise<Project[]> {
  const where: Record<string, any> = {
    status: { equals: 'published' },
  };

  if (featuredOnly) {
    where.featured = { equals: true };
  }

  return fetchCollection<Project>('projects', {
    where,
    sort: '-createdAt',
    locale,
  });
}

/**
 * Quick Projects Collection
 */
export interface QuickProject {
  id: string;
  title: string;
  briefDescription: string;
  visitUrl: string;
  projectType: string;
  tags: { tag: string; id?: string }[];
  cardImage?: {
    url: string;
    alt?: string;
    filename?: string;
  };
  order?: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export async function getQuickProjects(locale: string = 'en'): Promise<QuickProject[]> {
  return fetchCollection<QuickProject>('quick-projects', {
    where: { status: { equals: 'published' } },
    sort: 'order',
    locale,
  });
}

/**
 * Experiences Collection
 */
export interface Experience {
  id: string;
  title: string;
  company: string;
  descriptionNormal: string;
  descriptionHighlight: string;
  href: string;
  mainCompanyImage: {
    url: string;
    alt?: string;
  };
  order?: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export async function getExperiences(locale: string = 'en'): Promise<Experience[]> {
  return fetchCollection<Experience>('experiences', {
    where: { status: { equals: 'published' } },
    sort: 'order',
    locale,
  });
}

/**
 * Top Marquee Services Collection
 */
export interface TopMarqueeService {
  id: string;
  text: string;
  order?: number;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export async function getTopMarqueeServices(locale: string = 'en'): Promise<TopMarqueeService[]> {
  return fetchCollection<TopMarqueeService>('top-marquee-services', {
    where: { status: { equals: 'published' } },
    sort: 'order',
    locale,
  });
}
