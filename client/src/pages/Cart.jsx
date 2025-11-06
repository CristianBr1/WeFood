import { useState, useEffect, useContext } from "react";
import { Box, Button, Typography, Divider, Checkbox, IconButton } from "@mui/material";
import { Trash2 } from "lucide-react";
import { ThemeContext } from "../context/ThemeProvider";
import Navbar from "../components/Navbar";
import CartProductModal from "../components/CartProductModal";
import AddressForm from "../components/AddressForm";
import { useCartContext } from "../hooks/useCartContext";
import { useAddressContext } from "../hooks/useAddressContext";

import emptyCartImg from "../assets/images/cesta-vazia.png";
import { getImageUrl } from "../services/config";
import { calculateDeliveryFees } from "../config/fees.config";

const Cart = () => {
  const { darkMode } = useContext(ThemeContext);
  const { cart, loading, updateItem, removeItem, clearCart } = useCartContext();
  const { addresses: contextAddresses } = useAddressContext();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pickup, setPickup] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const subtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const { serviceFee, deliveryFee } = calculateDeliveryFees(pickup);
  const total = subtotal + serviceFee + deliveryFee;

  useEffect(() => {
    setAddresses(contextAddresses);
    if (!selectedAddress && contextAddresses.length > 0) {
      setSelectedAddress(contextAddresses[0]);
    }
  }, [contextAddresses, selectedAddress]);

  const handleQuantityChange = (item, delta) => {
    const newQuantity = Math.max(1, item.quantity + delta);
    updateItem(item.cartItemId, { ...item, quantity: newQuantity });
  };

  if (loading) return <Typography>Carregando seu carrinho...</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5", color: darkMode ? "#fff" : "#222" }}>
      <Navbar />
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 4, gap: 4, mt: 10, display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h5" sx={{ textAlign: "center" }}>Confira seus produtos</Typography>

          {cart.length === 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 4, gap: 2 }}>
              <img src={emptyCartImg} alt="Carrinho vazio" style={{ width: 200, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ opacity: 0.7 }}>Seu carrinho está vazio</Typography>
              <Button variant="contained" color="success" onClick={() => window.location.href = "/"}>Voltar às compras</Button>
            </Box>
          ) : (
            cart.map(item => (
              <Box key={item.cartItemId} sx={{ display: "flex", justifyContent: "space-between", p: 2, borderRadius: 2, backgroundColor: darkMode ? "#222" : "#fff", alignItems: "center", flexWrap: "wrap", cursor: "pointer" }} onClick={() => setSelectedProduct(item)}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <img src={item.image ? getImageUrl(item.image) : "/placeholder.jpg"} alt={item.name} style={{ width: 60, height: 60, borderRadius: 8, objectFit: "cover" }} />
                  <Box sx={{ minWidth: 150 }}>
                    <Typography>{item.name}</Typography>
                    {item.extras?.length > 0 && <Typography variant="body2">Extras: {item.extras.map(e => e.name).join(", ")}</Typography>}
                    {item.observations && <Typography variant="body2">Obs: {item.observations}</Typography>}
                    <Typography variant="body2">Unitário: R${(item.totalPrice / item.quantity).toFixed(2)}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: { xs: 1, md: 0 } }}>
                  <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); handleQuantityChange(item, -1); }}>−</Button>
                  <Typography>{item.quantity}</Typography>
                  <Button variant="outlined" size="small" onClick={e => { e.stopPropagation(); handleQuantityChange(item, 1); }}>+</Button>
                  <IconButton onClick={e => { e.stopPropagation(); removeItem(item.cartItemId); }} sx={{ color: "red" }}><Trash2 size={18} /></IconButton>
                  <Typography>R$ {item.totalPrice.toFixed(2)}</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {cart.length > 0 && (
          <Box sx={{ flex: 1, p: 2, borderRadius: 2, backgroundColor: darkMode ? "#222" : "#fff", display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
            <Typography variant="h5">Resumo da compra</Typography>
            <Divider sx={{ width: "100%" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}><Typography>Subtotal</Typography><Typography>R$ {subtotal.toFixed(2)}</Typography></Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}><Typography>Taxa de serviço</Typography><Typography>R$ {serviceFee.toFixed(2)}</Typography></Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}><Typography>Taxa de entrega</Typography><Typography>R$ {pickup ? 0 : deliveryFee.toFixed(2)}</Typography></Box>
            <Divider sx={{ width: "100%" }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", width: "100%" }}><Typography>Total</Typography><Typography>R$ {total.toFixed(2)}</Typography></Box>
            <Button variant="contained" color="success" size="large" fullWidth onClick={() => window.location.href = "/checkout"}>Ir para pagamento</Button>
          </Box>
        )}
      </Box>

      {selectedProduct && <CartProductModal item={selectedProduct} onClose={() => setSelectedProduct(null)} onUpdate={() => setSelectedProduct(null)} />}
    </Box>
  );
};

export default Cart;
