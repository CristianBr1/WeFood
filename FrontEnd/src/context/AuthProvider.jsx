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


  const addToCart = (item) => {
    const cartItem = { ...item, cartItemId: uuidv4() };
    setCart((prev) => [...prev, cartItem]);
  };


  const updateCartItem = (updatedItem) => {
    setCart((prev) =>
      prev.map((p) => (p.cartItemId === updatedItem.cartItemId ? updatedItem : p))
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
