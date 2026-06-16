import { apiFetch } from './api'
import type { SoftwareTag, SoftwareImage, PaginatedResponse } from './software'

export interface HardwareListItem {
  id: string
  slug: string
  name: string
  description: string | null
  brand: string | null
  price_model: 'fixed' | 'range' | 'subscription' | 'quote'
  price_min: number | null
  price_max: number | null
  is_featured: boolean
  view_count: number
  created_at: string
  thumbnail_url: string | null
  tags: SoftwareTag[]
}

export interface HardwareDetail extends HardwareListItem {
  specifications: Record<string, string> | null
  updated_at: string
  images: SoftwareImage[]
}

export interface HardwareListParams {
  q?: string
  tags?: string
  sort?: 'name_asc' | 'name_desc' | 'created_asc' | 'created_desc' | 'views' | 'featured'
  page?: number
  limit?: number
  featured?: 'true' | 'false'
  brand?: string
}

export function listHardware(
  params: HardwareListParams = {},
): Promise<PaginatedResponse<HardwareListItem>> {
  const qs = new URLSearchParams()
  if (params.q)        qs.set('q', params.q)
  if (params.tags)     qs.set('tags', params.tags)
  if (params.sort)     qs.set('sort', params.sort)
  if (params.page)     qs.set('page', String(params.page))
  if (params.limit)    qs.set('limit', String(params.limit))
  if (params.featured) qs.set('featured', params.featured)
  if (params.brand)    qs.set('brand', params.brand)

  const query = qs.toString()
  return apiFetch(`/hardware${query ? `?${query}` : ''}`)
}

export function getHardwareBySlug(slug: string): Promise<{ data: HardwareDetail }> {
  return apiFetch(`/hardware/${encodeURIComponent(slug)}`)
}
