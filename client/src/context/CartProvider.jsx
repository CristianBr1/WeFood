import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartService } from "../services/endpoints/cart.Service";
import { useAuthContext } from "../hooks/useAuthContext";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const { user } = useAuthContext(); // ainda útil pra saber se o usuário existe
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [error, setError] = useState(null);

  /** 🔹 Buscar carrinho */
  const refreshCart = useCallback(async (silent = false) => {
    if (!user) {
      setCart([]);
      if (!silent) setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    setError(null);

    try {
      // ✅ não precisa passar token — o cookie HTTP-only faz isso
      const data = await CartService.fetchCart();
      setCart(data);
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
      setError(err);
      setCart([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user]);

  /** 🔹 Adicionar item */
  const addItem = useCallback(async (item) => {
    if (!user) return alert("Você precisa estar logado para adicionar itens!");
    setOpLoading(true);

    try {
      await CartService.addItem(item);
      await refreshCart(true);
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [user, refreshCart]);

  /** 🔹 Atualizar item */
  const updateItem = useCallback(async (cartItemId, item) => {
    if (!user) return;
    setOpLoading(true);

    try {
      await CartService.updateItem(cartItemId, item);
      await refreshCart(true);
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [user, refreshCart]);

  /** 🔹 Remover item */
  const removeItem = useCallback(async (cartItemId) => {
    if (!user) return;
    setOpLoading(true);

    try {
      await CartService.removeItem(cartItemId);
      await refreshCart(true);
    } catch (err) {
      console.error("Erro ao remover item:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [user, refreshCart]);

  /** 🔹 Limpar carrinho */
  const clearCart = useCallback(async () => {
    if (!user) return;
    setOpLoading(true);

    try {
      await CartService.clearCart();
      setCart([]);
    } catch (err) {
      console.error("Erro ao limpar carrinho:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [user, refreshCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        opLoading,
        error,
        refreshCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
