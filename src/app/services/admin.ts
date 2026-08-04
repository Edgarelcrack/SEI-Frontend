import { apiFetch, buildAdminHeaders } from './api'

export type PriceModel = 'fixed' | 'range' | 'subscription' | 'quote'
export type ItemStatus = 'available' | 'unavailable'
export type AppliesTo = 'software' | 'hardware' | 'both'
export type AdminRole = 'admin' | 'super_admin'

export interface AdminUser {
  id: string
  email: string | null
  role: AdminRole
  is_active: boolean
  created_at: string
}

export interface AdminSession {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: {
    id: string
    email: string | undefined
    role: AdminRole
  }
}

export interface AdminPaginated<T> {
  data: T[]
  total: number
  page: number
  limit: number
  pages: number
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export function adminLogin(
  email: string,
  password: string,
): Promise<{ data: AdminSession }> {
  return apiFetch('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function adminMe(token: string): Promise<{ data: AdminUser }> {
  return apiFetch('/admin/auth/me', { headers: buildAdminHeaders(token) })
}

export function adminLogout(token: string): Promise<{ data: { logged_out: boolean } }> {
  return apiFetch('/admin/auth/logout', {
    method: 'POST',
    headers: buildAdminHeaders(token),
  })
}

export function adminFetch<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  return apiFetch<T>(`/admin${path}`, {
    ...init,
    headers: { ...buildAdminHeaders(token), ...init?.headers },
  })
}

function qs(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') sp.set(k, String(v))
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}

// ---------------------------------------------------------------------------
// Software
// ---------------------------------------------------------------------------

export interface AdminSoftwareListItem {
  id: string
  name: string
  slug: string
  status: ItemStatus
  is_featured: boolean
  sort_order: number
  price_model: PriceModel
  price_min: number | null
  price_max: number | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface AdminSoftwareDetail {
  id: string
  name: string
  slug: string
  tagline: string | null
  short_description: string | null
  overview: string | null
  technical_details: unknown
  api_integrations: unknown
  scalability_info: string | null
  security_info: string | null
  features: unknown
  tech_stack: unknown
  video_urls: unknown
  demo_url: string | null
  price_model: PriceModel
  price_min: number | null
  price_max: number | null
  status: ItemStatus
  is_featured: boolean
  sort_order: number
  view_count: number
  created_at: string
  updated_at: string
  software_images: { id: string; storage_path: string; alt_text: string | null; is_thumbnail: boolean; sort_order: number }[]
  software_tags: { tag_id: string; tags: { id: string; name: string; slug: string; applies_to: AppliesTo } | null }[]
}

export interface SoftwareInput {
  name: string
  slug: string
  tagline?: string | null
  short_description?: string | null
  overview?: string | null
  technical_details?: unknown
  api_integrations?: unknown
  scalability_info?: string | null
  security_info?: string | null
  features?: unknown
  tech_stack?: unknown
  video_urls?: unknown
  demo_url?: string | null
  price_model: PriceModel
  price_min?: number | null
  price_max?: number | null
  status: ItemStatus
  is_featured: boolean
  sort_order: number
  tag_ids?: string[]
}

export interface AdminListParams {
  q?: string
  status?: ItemStatus
  page?: number
  limit?: number
}

export function listAdminSoftware(token: string, params: AdminListParams = {}) {
  return adminFetch<AdminPaginated<AdminSoftwareListItem>>(`/software${qs({ ...params })}`, token)
}

export function getAdminSoftware(token: string, id: string) {
  return adminFetch<{ data: AdminSoftwareDetail }>(`/software/${id}`, token)
}

export function createAdminSoftware(token: string, body: SoftwareInput) {
  return adminFetch<{ data: { id: string } }>(`/software`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateAdminSoftware(token: string, id: string, body: Partial<SoftwareInput>) {
  return adminFetch<{ data: AdminSoftwareDetail }>(`/software/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteAdminSoftware(token: string, id: string) {
  return adminFetch<{ data: { deleted: boolean } }>(`/software/${id}`, token, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Hardware
// ---------------------------------------------------------------------------

export interface AdminHardwareListItem {
  id: string
  name: string
  slug: string
  brand: string | null
  status: ItemStatus
  is_featured: boolean
  sort_order: number
  price_model: PriceModel
  price_min: number | null
  price_max: number | null
  view_count: number
  created_at: string
  updated_at: string
}

export interface AdminHardwareDetail {
  id: string
  name: string
  slug: string
  description: string | null
  brand: string | null
  specifications: unknown
  price_model: PriceModel
  price_min: number | null
  price_max: number | null
  status: ItemStatus
  is_featured: boolean
  sort_order: number
  view_count: number
  created_at: string
  updated_at: string
  hardware_images: { id: string; storage_path: string; alt_text: string | null; is_thumbnail: boolean; sort_order: number }[]
  hardware_tags: { tag_id: string; tags: { id: string; name: string; slug: string; applies_to: AppliesTo } | null }[]
}

export interface HardwareInput {
  name: string
  slug: string
  description?: string | null
  brand?: string | null
  specifications?: unknown
  price_model: PriceModel
  price_min?: number | null
  price_max?: number | null
  status: ItemStatus
  is_featured: boolean
  sort_order: number
  tag_ids?: string[]
}

export function listAdminHardware(token: string, params: AdminListParams = {}) {
  return adminFetch<AdminPaginated<AdminHardwareListItem>>(`/hardware${qs({ ...params })}`, token)
}

export function getAdminHardware(token: string, id: string) {
  return adminFetch<{ data: AdminHardwareDetail }>(`/hardware/${id}`, token)
}

export function createAdminHardware(token: string, body: HardwareInput) {
  return adminFetch<{ data: { id: string } }>(`/hardware`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateAdminHardware(token: string, id: string, body: Partial<HardwareInput>) {
  return adminFetch<{ data: AdminHardwareDetail }>(`/hardware/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteAdminHardware(token: string, id: string) {
  return adminFetch<{ data: { deleted: boolean } }>(`/hardware/${id}`, token, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Imágenes
// ---------------------------------------------------------------------------

export type ImageKind = 'software' | 'hardware'

export interface AdminImage {
  id: string
  storage_path: string
  url: string
  alt_text: string | null
  is_thumbnail: boolean
  sort_order: number
  created_at: string
}

interface UploadUrlResponse {
  signed_url: string
  token: string
  storage_path: string
  bucket: string
  max_size: number
}

export function listAdminImages(token: string, kind: ImageKind, productId: string) {
  return adminFetch<{ data: AdminImage[] }>(`/images/${kind}/${productId}`, token)
}

export function updateAdminImage(
  token: string,
  kind: ImageKind,
  imageId: string,
  body: { alt_text?: string | null; is_thumbnail?: boolean; sort_order?: number },
) {
  return adminFetch<{ data: AdminImage }>(`/images/${kind}/image/${imageId}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function reorderAdminImages(
  token: string,
  kind: ImageKind,
  productId: string,
  imageIds: string[],
) {
  return adminFetch<{ data: AdminImage[] }>(`/images/${kind}/${productId}/reorder`, token, {
    method: 'PUT',
    body: JSON.stringify({ image_ids: imageIds }),
  })
}

export function deleteAdminImage(token: string, kind: ImageKind, imageId: string) {
  return adminFetch<{ data: { deleted: boolean } }>(`/images/${kind}/image/${imageId}`, token, {
    method: 'DELETE',
  })
}

/**
 * Sube una imagen en tres pasos:
 *
 *   1. Pide al backend una URL firmada de subida.
 *   2. Hace PUT del archivo DIRECTO a Supabase Storage.
 *   3. Registra la ruta resultante en la base de datos.
 *
 * El paso 2 no toca la función serverless a propósito: Vercel limita el body de
 * request a ~4.5 MB, por debajo del límite de 5 MB del bucket, así que subir a
 * través del backend fallaría con las imágenes grandes.
 */
export async function uploadAdminImage(
  token: string,
  kind: ImageKind,
  productId: string,
  file: File,
  altText?: string,
): Promise<AdminImage> {
  const { data: upload } = await adminFetch<{ data: UploadUrlResponse }>(
    `/images/${kind}/${productId}/upload-url`,
    token,
    {
      method: 'POST',
      body: JSON.stringify({ content_type: file.type, size: file.size }),
    },
  )

  const res = await fetch(upload.signed_url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'cache-control': 'max-age=31536000',
    },
    body: file,
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`No se pudo subir la imagen a Storage. ${detail}`.trim())
  }

  const { data } = await adminFetch<{ data: AdminImage }>(`/images/${kind}/${productId}`, token, {
    method: 'POST',
    body: JSON.stringify({
      storage_path: upload.storage_path,
      alt_text: altText?.trim() || null,
    }),
  })

  return data
}

// ---------------------------------------------------------------------------
// Tags
// ---------------------------------------------------------------------------

export interface AdminTag {
  id: string
  name: string
  slug: string
  applies_to: AppliesTo
  created_at: string
}

export interface TagInput {
  name: string
  slug: string
  applies_to: AppliesTo
}

export function listAdminTags(token: string, params: { q?: string; applies_to?: AppliesTo } = {}) {
  return adminFetch<{ data: AdminTag[] }>(`/tags${qs({ ...params })}`, token)
}

export function createAdminTag(token: string, body: TagInput) {
  return adminFetch<{ data: AdminTag }>(`/tags`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateAdminTag(token: string, id: string, body: Partial<TagInput>) {
  return adminFetch<{ data: AdminTag }>(`/tags/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteAdminTag(token: string, id: string) {
  return adminFetch<{ data: { deleted: boolean } }>(`/tags/${id}`, token, { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Leads
// ---------------------------------------------------------------------------

export type LeadStatus = 'new' | 'contacted' | 'closed'

export interface AdminLead {
  id: string
  name: string
  email: string
  company: string | null
  service_type: string | null
  message: string
  status: LeadStatus
  created_at: string
}

export function listAdminLeads(
  token: string,
  params: { status?: LeadStatus; q?: string; page?: number; limit?: number } = {},
) {
  return adminFetch<AdminPaginated<AdminLead>>(`/leads${qs({ ...params })}`, token)
}

export function updateAdminLeadStatus(token: string, id: string, status: LeadStatus) {
  return adminFetch<{ data: AdminLead }>(`/leads/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

// ---------------------------------------------------------------------------
// Users (super_admin)
// ---------------------------------------------------------------------------

export interface AdminUserFull {
  id: string
  email: string | null
  role: AdminRole
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface CreateUserInput {
  email: string
  password: string
  role: AdminRole
}

export function listAdminUsers(token: string) {
  return adminFetch<{ data: AdminUserFull[] }>(`/users`, token)
}

export function createAdminUser(token: string, body: CreateUserInput) {
  return adminFetch<{ data: AdminUserFull }>(`/users`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function updateAdminUser(
  token: string,
  id: string,
  body: { role?: AdminRole; is_active?: boolean },
) {
  return adminFetch<{ data: AdminUserFull }>(`/users/${id}`, token, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export function deleteAdminUser(token: string, id: string) {
  return adminFetch<{ data: { deleted: boolean } }>(`/users/${id}`, token, { method: 'DELETE' })
}
