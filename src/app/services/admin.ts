import { apiFetch, buildAdminHeaders } from './api'

export interface AdminUser {
  id: string
  email: string | null
  role: 'admin' | 'super_admin'
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
    role: 'admin' | 'super_admin'
  }
}

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
