import { apiFetch } from './api'

export interface SoftwareTag {
  id: string
  name: string
  slug: string
}

export interface SoftwareImage {
  id: string
  url: string
  alt_text: string | null
  is_thumbnail: boolean
  sort_order: number
}

export interface SoftwareListItem {
  id: string
  slug: string
  name: string
  tagline: string | null
  short_description: string | null
  price_model: 'fixed' | 'range' | 'subscription' | 'quote'
  price_min: number | null
  price_max: number | null
  is_featured: boolean
  view_count: number
  created_at: string
  thumbnail_url: string | null
  tags: SoftwareTag[]
}

export interface SoftwareDetail extends SoftwareListItem {
  overview: string | null
  technical_details: string[] | null
  api_integrations: string[] | null
  scalability_info: string | null
  security_info: string | null
  features: string[] | null
  tech_stack: string[] | null
  video_urls: string[] | null
  demo_url: string | null
  updated_at: string
  images: SoftwareImage[]
}

export interface SoftwareListParams {
  q?: string
  tags?: string
  sort?: 'name_asc' | 'name_desc' | 'created_asc' | 'created_desc' | 'views' | 'featured'
  page?: number
  limit?: number
  featured?: 'true' | 'false'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function listSoftware(
  params: SoftwareListParams = {},
): Promise<PaginatedResponse<SoftwareListItem>> {
  const qs = new URLSearchParams()
  if (params.q)        qs.set('q', params.q)
  if (params.tags)     qs.set('tags', params.tags)
  if (params.sort)     qs.set('sort', params.sort)
  if (params.page)     qs.set('page', String(params.page))
  if (params.limit)    qs.set('limit', String(params.limit))
  if (params.featured) qs.set('featured', params.featured)

  const query = qs.toString()
  return apiFetch(`/software${query ? `?${query}` : ''}`)
}

export function getSoftwareBySlug(slug: string): Promise<{ data: SoftwareDetail }> {
  return apiFetch(`/software/${encodeURIComponent(slug)}`)
}
