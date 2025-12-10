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
 * With retry logic and graceful error handling for production
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
  const maxRetries = 3;
  const timeoutMs = 15000; // 15 second timeout (increased from 10s)
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
      
      console.log(`[CMS] Fetching ${collection} (attempt ${attempt}/${maxRetries}): ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error(`[CMS] Fetch failed with status ${response.status}: ${response.statusText}`);
        // If we got a server error (5xx), retry
        if (response.status >= 500 && attempt < maxRetries) {
          console.log(`[CMS] Server error, retrying in ${attempt * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
        throw new Error(`Failed to fetch ${collection}: ${response.status} ${response.statusText}`);
      }

      const data: CMSResponse<T> = await response.json();
      
      if (!data || !Array.isArray(data.docs)) {
        console.error(`[CMS] Invalid response format for ${collection}`);
        return [];
      }
      
      console.log(`[CMS] Successfully fetched ${data.docs.length} ${collection}`);
      return data.docs;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[CMS] Error fetching ${collection} (attempt ${attempt}/${maxRetries}):`, errorMessage);
      
      // If it's a timeout or network error and we have retries left, try again
      if (attempt < maxRetries) {
        const isRetryableError = 
          errorMessage.includes('abort') || 
          errorMessage.includes('timeout') ||
          errorMessage.includes('network') ||
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('fetch failed');
          
        if (isRetryableError) {
          console.log(`[CMS] Retryable error, waiting ${attempt * 1000}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          continue;
        }
      }
      
      // After all retries or non-retryable error, return empty array
      // This prevents the serverless function from crashing
      console.error(`[CMS] All retries exhausted or non-retryable error for ${collection}. Returning empty array.`);
      return [];
    }
  }
  
  // Fallback (should not reach here, but just in case)
  return [];
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
  // Case study fields
  mainTag?: string;
  uploadDate?: string;
  authorImage?: {
    url: string;
    alt?: string;
  };
  authorName?: string;
  briefDescription?: any; // Rich text field
  articleSections?: {
    heading: string;
    paragraphs: any; // Rich text field
  }[];
  mainImage?: {
    url: string;
    alt?: string;
  };
  quote?: {
    text: any; // Rich text field
    author: string;
  };
  galleryImages?: {
    image: {
      url: string;
      alt?: string;
    };
    id?: string;
  }[];
  techStack?: {
    heading: string;
    description: any; // Rich text field
  }[];
  workflowSteps?: {
    description: any; // Rich text field
  }[];
  achievements?: {
    title: string;
    description: any; // Rich text field
  }[];
  finalTitle?: string;
  finalTags?: {
    tag: string;
    id?: string;
  }[];
  caseStudyHeroImage?: {
    url: string;
    alt?: string;
  };
  caseStudyDescription?: string;
  faqs?: {
    question: string;
    answer: string;
    id?: string;
  }[];
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
