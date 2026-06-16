import { apiFetch } from './api'

export interface Tag {
  id: string
  name: string
  slug: string
  applies_to: 'software' | 'hardware' | 'both'
  created_at: string
}

export function listTags(applies_to?: 'software' | 'hardware' | 'both'): Promise<{ data: Tag[] }> {
  const qs = applies_to ? `?applies_to=${applies_to}` : ''
  return apiFetch(`/tags${qs}`)
}
