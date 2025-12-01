import { createContext, useContext, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import type { ICartItem, ICartItemResponse, ICartSyncPayload } from "@/types/cart";
import type { IProduct } from "@/types/product";
import CartService from "@/services/cart-service";
import { AuthContext } from "./AuthContext";

interface CartContextType {
  items: ICartItem[];
  count: number;
  total: number;
  addToCart: (product: IProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isLoadingCart: boolean;
}

export const CartContext = createContext({} as CartContextType);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { authenticated } = useContext(AuthContext);
  
  const [items, setItems] = useState<ICartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const isInitialSyncDone = useRef(false);
  const prevAuthenticated = useRef(authenticated);
  
  const debounceTimeout = useRef<number | null>(null);

  // 1. Carga inicial do LocalStorage (Guest)
  useEffect(() => {
    const storedCart = localStorage.getItem("boardsandcats_cart");
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
            setItems(parsed);
        }
      } catch (e) {
        console.error("Erro ao ler carrinho local:", e);
        localStorage.removeItem("boardsandcats_cart");
      }
    }
    setIsLoadingCart(false);
  }, []);

  // 2. Persistência no LocalStorage
  useEffect(() => {
    if (!isLoadingCart) {
      localStorage.setItem("boardsandcats_cart", JSON.stringify(items));
    }
  }, [items, isLoadingCart]);

  // 3. Lógica de Sincronização e Logout
  useEffect(() => {
    if (prevAuthenticated.current && !authenticated) {
        setItems([]);
        isInitialSyncDone.current = false;
    }

    // Detecta Login
    if (!prevAuthenticated.current && authenticated) {
        syncOnLogin();
    }

    // Atualiza a ref para o próximo ciclo
    prevAuthenticated.current = authenticated;

  }, [authenticated]);

  const syncOnLogin = async () => {
    if (!isInitialSyncDone.current) {
      setIsLoadingCart(true);
      try {
        const response = await CartService.getCart();
        
        
        const serverItems: ICartItemResponse[] = (response.success && response.data && response.data.items) 
          ? response.data.items 
          : [];

        
        if (serverItems.length > 0) {
            
            
            if (items.length === 0) {
               
               const mappedItems: ICartItem[] = serverItems.map(i => ({
                  product: i.product,
                  quantity: i.quantity
               }));
               setItems(mappedItems);
            } else {
               
               await sendCartToBackend(items);
            }
        } 
        
        else if (items.length > 0) {
            
            await sendCartToBackend(items);
        }
        
      } catch (error) {
        console.error("Erro ao sincronizar carrinho:", error);
      } finally {
        isInitialSyncDone.current = true;
        setIsLoadingCart(false);
      }
    }
};

  // 4. Auto-Save
  useEffect(() => {
    if (authenticated && isInitialSyncDone.current) {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        sendCartToBackend(items);
      }, 2000);
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [items, authenticated]);

  const sendCartToBackend = async (currentItems: ICartItem[]) => {
    const payload: ICartSyncPayload = {
      items: currentItems.map(i => ({
        productId: i.product.id!,
        quantity: i.quantity
      }))
    };
    const res = await CartService.syncCart(payload);
    if (!res.success) {
        console.warn("Falha no salvamento automático do carrinho:", res.message);
    }
  };

  // --- Ações do Carrinho ---
  const addToCart = (product: IProduct) => {
    setItems(prev => {
      const exists = prev.find(i => i.product.id === product.id);
      if (exists) {
        return prev.map(i => 
          i.product.id === product.id 
            ? { ...i, quantity: i.quantity + 1 } 
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(i => 
      i.product.id === productId ? { ...i, quantity } : i
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      count, 
      total, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      isLoadingCart
    }}>
      {children}
    </CartContext.Provider>
  );
};