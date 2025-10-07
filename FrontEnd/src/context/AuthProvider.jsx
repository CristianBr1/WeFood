import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

const AuthProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const itemData = {
      ...product,
      cartItemId: uuidv4(),
      originalExtras: product.originalExtras || product.extras || [],
    };

    setCart((prev) => [...prev, itemData]);
  };

  const updateCartItem = (updatedItem) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartItemId === updatedItem.cartItemId) {
          return {
            ...item,
            ...updatedItem,
            extras: updatedItem.extras || [],
            totalPrice: updatedItem.totalPrice || item.totalPrice,
            originalExtras:
              item.originalExtras?.length > 0
                ? item.originalExtras
                : updatedItem.originalExtras || [],
          };
        }
        return item;
      })
    );
  };

  const incrementQuantity = (item) => {
    setCart((prev) =>
      prev.map((p) =>
        p.cartItemId === item.cartItemId
          ? {
              ...p,
              quantity: p.quantity + 1,
              totalPrice: (p.totalPrice / p.quantity) * (p.quantity + 1),
            }
          : p
      )
    );
  };

  const decrementQuantity = (item) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.cartItemId === item.cartItemId
            ? {
                ...p,
                quantity: p.quantity - 1,
                totalPrice: (p.totalPrice / p.quantity) * (p.quantity - 1),
              }
            : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (item) => {
    setCart((prev) => prev.filter((i) => i.cartItemId !== item.cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider
      value={{
        cart,
        addToCart,
        updateCartItem,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        searchItem,
        setSearchItem,
        removeFromCart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
