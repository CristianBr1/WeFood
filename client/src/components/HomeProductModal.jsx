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
  const { addItem } = useCartContext();
  const { getProductById } = useProducts();

  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [meatCount, setMeatCount] = useState(1);
  const [productQuantity, setProductQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  // Reset e fetch completo
  useEffect(() => {
    let mounted = true;

    const fetchFullProduct = async () => {
      if (!initialProduct) return;

      try {
        setProductLoading(true);

        if (
          Array.isArray(initialProduct.extras) &&
          initialProduct.meatOptions
        ) {
          setProduct(initialProduct);
          setMeatCount(initialProduct.meatOptions.min || 1);
        } else {
          const full = await getProductById(
            initialProduct._id || initialProduct
          );
          if (mounted) {
            setProduct(full);
            setMeatCount(full.meatOptions?.min || 1);
          }
        }

        setSelectedExtras([]);
        setProductQuantity(1);
        setObservations("");
      } catch (err) {
        console.error("Erro ao buscar detalhes do produto:", err);
      } finally {
        if (mounted) setProductLoading(false);
      }
    };

    fetchFullProduct();
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

  if (!product) return null;

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const meatExtraPrice =
    (meatCount - 1) * (product?.meatOptions?.pricePerExtra || 0);
  const totalPrice =
    (product.price + extrasTotal + meatExtraPrice) * productQuantity;

  const handleAdd = async () => {
    await addItem({
      productId: product._id,
      name: product.name,
      image: product.image,
      quantity: productQuantity,
      extras: selectedExtras.map((e) => ({ name: e.name, price: e.price })),
      meatCount,
      observations,
      price: product.price,
      totalPrice,
    });
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        background: darkMode ? "rgba(34,34,34,0.85)" : "rgba(0,0,0,0.4)",
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
          position: "relative",
        }}
      >
        {/* Botão de fechar responsivo */}
        <IconButton
          onClick={onClose}
          size="large"
          sx={{
            position: "absolute",
            top: 10,
            right: { xs: "50%", md: 10 }, // centraliza em xs e direita em md+
            transform: { xs: "translateX(50%)", md: "none" }, // ajusta para centro em xs
            color: "red",
            backgroundColor: darkMode ? "#333" : "#fff",
            borderRadius: "50%",
            width: 40,
            height: 40,
            zIndex: 20,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            "&:hover": {
              backgroundColor: darkMode ? "#444" : "#f0f0f0",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <div className="modal-contents">
          <div className="product-image" style={{ position: "relative" }}>
            {productLoading && (
              <CircularProgress
                size={48}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            )}
            {!productLoading && (
              <img
                src={
                  product.image
                    ? getImageUrl(product.image)
                    : "/placeholder.jpg"
                }
                alt={product.name}
              />
            )}
          </div>

          {!productLoading && (
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
          )}
        </div>

        {!productLoading && (
          <div className="modal-footer">
            <div className="quantity-controls">
              <Button
                variant="outlined"
                size="small"
                onClick={() =>
                  setProductQuantity((prev) => Math.max(1, prev - 1))
                }
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
            </div>

            <Button
              className="add-cart-btn"
              variant="contained"
              color="success"
              onClick={handleAdd}
            >
              Adicionar R$ {totalPrice.toFixed(2)}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(HomeProductModal);
