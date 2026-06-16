const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/api/v1'

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(res.status, (body as any).error ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<T>
}

export function buildAdminHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` }
}

export function formatPrice(
  model: string,
  min: number | null,
  max: number | null,
): string {
  const cop = (n: number) => '$' + Math.round(n).toLocaleString('es-CO')

  switch (model) {
    case 'fixed':
      return min != null ? cop(min) : 'Precio a convenir'
    case 'range':
      return min != null && max != null
        ? `${cop(min)} – ${cop(max)}`
        : 'Precio a convenir'
    case 'subscription':
      return min != null ? `${cop(min)}/mes` : 'Precio a convenir'
    default:
      return 'Precio a convenir'
  }
}
