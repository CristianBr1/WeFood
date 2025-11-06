import { useContext } from "react";
import { CartContext } from "../context/CartProvider";

export const useCartContext = () => useContext(CartContext);
