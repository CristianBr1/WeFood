import { memo, useState, useEffect, useContext } from "react";
import { getImageUrl } from "../services/config";
import { ThemeContext } from "../context/ThemeProvider";
import { useCartContext } from "../hooks/useCartContext";
import { useProducts } from "../hooks/useProducts";
import CloseIcon from "@mui/icons-material/Close";
import { Button, IconButton, CircularProgress } from "@mui/material";
import "../styles/ProductModal.css";

const HomeProductModal = ({ product: initialProduct, onClose }) => {
  const { darkMode } = useContext(ThemeContext);
  const { addItem } = useCartContext(); // use shared CartContext so Navbar updates
  const { getProductById } = useProducts();

  const [product, setProduct] = useState(initialProduct);
  const [productLoading, setProductLoading] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [meatCount, setMeatCount] = useState(
    initialProduct?.meatOptions?.min || 1
  );
  const [productQuantity, setProductQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  // resetar ao abrir
  useEffect(() => {
    setProduct(initialProduct);
    setSelectedExtras([]);
    setMeatCount(initialProduct?.meatOptions?.min || 1);
    setProductQuantity(1);
    setObservations("");
  }, [initialProduct]);

  // If incoming product is incomplete (no extras/meatOptions), fetch full details
  useEffect(() => {
    let mounted = true;
    const needFetch = (p) => {
      if (!p) return true;
      // if extras or meatOptions are missing, request full product
      return !Array.isArray(p.extras) || p.meatOptions === undefined;
    };

    const fetchDetail = async () => {
      if (!initialProduct) return;
      if (!needFetch(initialProduct)) return;
      try {
        setProductLoading(true);
        const full = await getProductById(initialProduct._id || initialProduct);
        if (mounted && full) setProduct(full);
      } catch (err) {
        // keep using initialProduct on error
        console.error("Erro ao buscar detalhes do produto:", err);
      } finally {
        setProductLoading(false);
      }
    };

    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [initialProduct, getProductById]);

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, extra]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const meatExtraPrice =
    (meatCount - 1) * (product?.meatOptions?.pricePerExtra || 0);
  const totalPrice =
    (product?.price + extrasTotal + meatExtraPrice) * productQuantity;

  const handleAdd = async () => {
    const cartItem = {
      productId: product._id, // ID do produto
      name: product.name,     // Nome do produto para exibição
      image: product.image,   // Imagem do produto
      quantity: productQuantity,
      extras: selectedExtras.map((e) => ({ name: e.name, price: e.price })),
      meatCount,
      observations,
      price: product.price,   // Preço base do produto
      totalPrice,
    };
    console.log('Adicionando ao carrinho:', cartItem);
    await addItem(cartItem);
    onClose();
  };

  if (!product) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        background: darkMode ? "rgba(34,34,34,0.85)" : "rgba(0,0,0,0.4)",
        color: darkMode ? "#fff" : "#222",
        zIndex: 1000,
      }}
    >
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: darkMode ? "#222" : "#fff",
          color: darkMode ? "#fff" : "#222",
          border: darkMode ? "1.5px solid #444" : "1.5px solid #eee",
        }}
      >
        <IconButton
          onClick={onClose}
          size="large"
          sx={{ position: "absolute", top: 10, right: 10, color: "red" }}
        >
          <CloseIcon />
        </IconButton>

        <div className="modal-contents">
          <div className="product-image" style={{ position: "relative" }}>
              {productLoading && (
                <CircularProgress
                  size={48}
                  sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                />
              )}
              <img src={product.image ? getImageUrl(product.image) : "/placeholder.jpg"} alt={product.name} />
            </div>

          <div className="product-info">
            <div className="modal-header">{product.name}</div>
            <div className="modal-body">
              <p>{product.description}</p>

              {product.extras?.length > 0 && (
                <div>
                  <h4>Extras</h4>
                  {product.extras.map((extra, idx) => (
                    <label key={idx} className="extra-option pl-5">
                      <input
                        type="checkbox"
                        checked={selectedExtras.some(
                          (e) => e.name === extra.name
                        )}
                        onChange={() => toggleExtra(extra)}
                      />
                      {extra.name} (+ R$ {extra.price.toFixed(2)})
                    </label>
                  ))}
                </div>
              )}

              {product.meatOptions && (
                <div className="meat-selector">
                  <h4>Quantidade de carnes</h4>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setMeatCount((prev) =>
                        Math.max(product.meatOptions.min, prev - 1)
                      )
                    }
                  >
                    -
                  </Button>
                  <span style={{ margin: "0 8px" }}>{meatCount}</span>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setMeatCount((prev) =>
                        Math.min(product.meatOptions.max, prev + 1)
                      )
                    }
                  >
                    +
                  </Button>
                  {meatCount > 1 && (
                    <p className="extra-meat-price">
                      + R${" "}
                      {(
                        product.meatOptions.pricePerExtra *
                        (meatCount - 1)
                      ).toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              <h4>Observações</h4>
              <textarea
                placeholder="Alguma observação sobre o pedido?"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div
          className="modal-footer"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => setProductQuantity((prev) => Math.max(1, prev - 1))}
          >
            -
          </Button>
          <span>{productQuantity}</span>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setProductQuantity((prev) => prev + 1)}
          >
            +
          </Button>

          <Button variant="contained" color="success" onClick={handleAdd}>
            Adicionar ao carrinho - R$ {totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(HomeProductModal);
