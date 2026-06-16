import { apiFetch } from './api'

export interface ContactForm {
  name: string
  email: string
  company?: string
  service_type?: 'software' | 'hardware' | 'ambos' | 'otro'
  message: string
}

export interface ContactLead {
  id: string
  name: string
  email: string
  company: string | null
  service_type: string | null
  message: string
  status: string
  created_at: string
}

export function submitContact(data: ContactForm): Promise<{ data: ContactLead }> {
  return apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
