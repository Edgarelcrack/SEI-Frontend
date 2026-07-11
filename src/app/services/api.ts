const BASE = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001') + '/api/v1'

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
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

/**
 * Normaliza una URL de YouTube al formato embebible (`/embed/VIDEO_ID`).
 * Acepta `watch?v=`, `youtu.be/`, `shorts/` o un embed ya válido.
 * Devuelve la URL original si no se reconoce.
 */
export function toYouTubeEmbed(url: string): string {
  if (!url) return url
  if (url.includes('/embed/')) return url

  let id = ''
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      id = u.pathname.slice(1)
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v') ?? ''
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] ?? ''
    }
  } catch {
    return url
  }

  return id ? `https://www.youtube.com/embed/${id}` : url
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
