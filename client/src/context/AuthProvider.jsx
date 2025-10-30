import { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [cart, setCart] = useState(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user.email}`);
      return storedCart ? JSON.parse(storedCart) : [];
    }
    return [];
  });

  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      const storedCart = localStorage.getItem(`cart_${user.email}`);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } else {
      localStorage.removeItem("user");
      setCart([]);
    }
  }, [user]);

  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === email)) return false;

    const newUser = { id: uuidv4(), name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    setUser(newUser);
    return true;
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    if (!user) {
      alert("Você precisa estar logado para adicionar itens ao carrinho!");
      return;
    }
    const itemData = {
      ...product,
      cartItemId: uuidv4(),
      originalExtras: product.originalExtras || product.extras || [],
    };
    setCart((prev) => [...prev, itemData]);
  };

  const updateCartItem = (updatedItem) => {
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === updatedItem.cartItemId
          ? { ...item, ...updatedItem }
          : item
      )
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
    if (user) localStorage.removeItem(`cart_${user.email}`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        cart,
        addToCart,
        updateCartItem,
        incrementQuantity,
        decrementQuantity,
        clearCart,
        removeFromCart,
        searchItem,
        setSearchItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
