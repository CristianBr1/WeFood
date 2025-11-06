import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { CartService } from "../services/endpoints/cart.Service";
import { useAuthContext } from "../hooks/useAuthContext";

export const CartContext = createContext(null);

const CartProvider = ({ children }) => {
  const { user } = useAuthContext();
  const token = user?.token;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opLoading, setOpLoading] = useState(false);
  const [error, setError] = useState(null);

  /** 🔹 Buscar carrinho */
  const refreshCart = useCallback(async (silent = false) => {
    if (!token) {
      setCart([]);
      if (!silent) setLoading(false);
      return;
    }
    if (!silent) setLoading(true);
    setError(null);

    try {
      const data = await CartService.fetchCart(token);
      setCart(data);
    } catch (err) {
      console.error("Erro ao buscar carrinho:", err);
      setError(err);
      setCart([]);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token]);

  /** 🔹 Adicionar item */
  const addItem = useCallback(async (item) => {
    if (!token) return alert("Você precisa estar logado para adicionar itens!");
    setOpLoading(true);

    try {
      await CartService.addItem(item, token);
      await refreshCart(true);
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [token, refreshCart]);

  /** 🔹 Atualizar item */
  const updateItem = useCallback(async (cartItemId, item) => {
    if (!token) return;
    setOpLoading(true);

    try {
      await CartService.updateItem(cartItemId, item, token);
      await refreshCart(true);
    } catch (err) {
      console.error("Erro ao atualizar item:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [token, refreshCart]);

  /** 🔹 Remover item */
  const removeItem = useCallback(async (cartItemId) => {
    if (!token) return;
    setOpLoading(true);

    try {
      await CartService.removeItem(cartItemId, token);
      await refreshCart(true);
    } catch (err) {
      console.error("Erro ao remover item:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [token, refreshCart]);

  /** 🔹 Limpar carrinho */
  const clearCart = useCallback(async () => {
    if (!token) return;
    setOpLoading(true);

    try {
      await CartService.clearCart(token);
      setCart([]);
    } catch (err) {
      console.error("Erro ao limpar carrinho:", err);
      setError(err);
    } finally {
      setOpLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [token, refreshCart]);

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
