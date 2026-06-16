import { apiFetch } from './api'

const CART_TOKEN_KEY = 'sei_cart_token'

export type ItemType = 'software' | 'hardware'

export interface CartProduct {
  type: ItemType
  id: string
  name: string
  slug: string
  price_model: string
  price_min: number | null
  price_max: number | null
  thumbnail_url: string | null
}

export interface CartItem {
  id: string
  item_type: ItemType
  item_id: string
  quantity: number
  product: CartProduct | null
}

export interface Cart {
  id: string
  status: string
  last_activity_at: string
  created_at: string
  items: CartItem[]
}

export function getCartToken(): string {
  let token = localStorage.getItem(CART_TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(CART_TOKEN_KEY, token)
  }
  return token
}

function cartHeaders(): HeadersInit {
  return { 'X-Session-Token': getCartToken() }
}

export function getOrCreateCart(): Promise<{ data: Omit<Cart, 'items'> }> {
  return apiFetch('/cart', { method: 'POST', headers: cartHeaders() })
}

export function getCart(): Promise<{ data: Cart }> {
  return apiFetch('/cart', { headers: cartHeaders() })
}

export function addCartItem(
  item_type: ItemType,
  item_id: string,
  quantity = 1,
): Promise<{ data: CartItem }> {
  return apiFetch('/cart/items', {
    method: 'POST',
    headers: cartHeaders(),
    body: JSON.stringify({ item_type, item_id, quantity }),
  })
}

export function removeCartItem(itemId: string): Promise<{ data: { deleted: boolean } }> {
  return apiFetch(`/cart/items/${itemId}`, {
    method: 'DELETE',
    headers: cartHeaders(),
  })
}

export function checkoutCart(): Promise<{ data: { whatsapp_url: string } }> {
  return apiFetch('/cart/checkout', { method: 'POST', headers: cartHeaders() })
}
