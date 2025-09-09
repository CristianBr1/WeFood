import { useState } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [searchItem, setSearchItem] = useState("");

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const allStates = { cart, addToCart, removeFromCart, clearCart, searchItem, setSearchItem };

  return (
    <AuthContext.Provider value={allStates}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
