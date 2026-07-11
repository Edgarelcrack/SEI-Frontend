import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  addCartItem,
  checkoutCart,
  getCart,
  getOrCreateCart,
  removeCartItem,
  type Cart,
  type ItemType,
} from "../services/cart";

interface CartContextType {
  cart: Cart | null;
  itemCount: number;
  isOpen: boolean;
  checkingOut: boolean;
  addingId: string | null;
  removingId: string | null;
  error: string | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (type: ItemType, id: string, quantity?: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  checkout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const noop = () => {};
const asyncNoop = async () => {};

const CartContext = createContext<CartContextType>({
  cart: null,
  itemCount: 0,
  isOpen: false,
  checkingOut: false,
  addingId: null,
  removingId: null,
  error: null,
  openCart: noop,
  closeCart: noop,
  toggleCart: noop,
  addItem: asyncNoop,
  removeItem: asyncNoop,
  checkout: asyncNoop,
  refresh: asyncNoop,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await getCart();
      setCart(res.data);
    } catch {
      // Sin carrito todavía para este token: estado vacío.
      setCart(null);
    }
  }, []);

  // Hidrata el carrito al montar (recupera el token de localStorage).
  useEffect(() => {
    refresh();
  }, [refresh]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  const addItem = useCallback(
    async (type: ItemType, id: string, quantity = 1) => {
      setAddingId(id);
      setError(null);
      try {
        await getOrCreateCart();
        await addCartItem(type, id, quantity);
        await refresh();
        setIsOpen(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo agregar al carrito.");
      } finally {
        setAddingId(null);
      }
    },
    [refresh],
  );

  const removeItem = useCallback(
    async (itemId: string) => {
      setRemovingId(itemId);
      setError(null);
      try {
        await removeCartItem(itemId);
        await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo eliminar el producto.");
      } finally {
        setRemovingId(null);
      }
    },
    [refresh],
  );

  const checkout = useCallback(async () => {
    setCheckingOut(true);
    setError(null);
    try {
      const res = await checkoutCart();
      window.open(res.data.whatsapp_url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo generar la cotización.");
    } finally {
      setCheckingOut(false);
    }
  }, []);

  const itemCount = cart?.items.reduce((sum, it) => sum + it.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isOpen,
        checkingOut,
        addingId,
        removingId,
        error,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        checkout,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
