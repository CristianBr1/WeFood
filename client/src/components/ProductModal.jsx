import { memo, useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeContext } from "../context/ThemeProvider";
import "../styles/ProductModal.css";

const ProductModal = ({
  product,
  onClose,
  isEdit,
  showOriginalExtras = false,
}) => {
  if (!product) return null;

  const { darkMode } = useContext(ThemeContext);
  const { addToCart, updateCartItem } = useContext(AuthContext);

  // Inicializa selectedExtras dependendo se estamos no Carrinho ou Home
  const [selectedExtras, setSelectedExtras] = useState(
    showOriginalExtras ? product.extras || [] : []
  );
  const [meatCount, setMeatCount] = useState(
    product.meatCount || product.meatOptions?.min || 1
  );
  const [productQuantity, setProductQuantity] = useState(product.quantity || 1);
  const [observations, setObservations] = useState(product.observations || "");

  // Atualiza estado se for edição
  useEffect(() => {
    if (isEdit) {
      setSelectedExtras(product.extras || []);
      setMeatCount(product.meatCount || 1);
      setProductQuantity(product.quantity || 1);
      setObservations(product.observations || "");
    }
  }, [isEdit, product]);

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, extra]
    );
  };

  const extrasToShow = showOriginalExtras
    ? product.originalExtras || []
    : product.extras || [];
  const extrasTotal = selectedExtras.reduce(
    (sum, extra) => sum + extra.price,
    0
  );
  const meatExtraPrice =
    (meatCount - 1) * (product.meatOptions?.pricePerExtra || 5);
  const totalPrice =
    (product.price + extrasTotal + meatExtraPrice) * productQuantity;

  const handleAddOrUpdate = () => {
    const itemData = {
      ...product,
      extras: selectedExtras,
      meatCount,
      quantity: productQuantity,
      observations,
      totalPrice,
      originalExtras: product.originalExtras || product.extras || [],
    };

    if (isEdit) {
      updateCartItem({ ...itemData, cartItemId: product.cartItemId });
    } else {
      addToCart(itemData);
    }
    onClose();
  };

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
          boxShadow: darkMode ? "none" : "0 2px 16px 0 rgba(0,0,0,0.18)",
        }}
      >
        <button
          className="close-button"
          onClick={onClose}
          style={{ background: "transparent" }}
        >
          <CloseIcon className="text-red-600" />
        </button>

        <div
          className="modal-contents"
          style={{ color: darkMode ? "#fff" : "#222" }}
        >
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-info">
            <div
              className="modal-header"
              style={{ color: darkMode ? "#fff" : "#222" }}
            >
              {product.name}
            </div>

            <div className="modal-body">
              <p>{product.description}</p>

              {extrasToShow.length > 0 && (
                <div>
                  <h4>Extras</h4>
                  {extrasToShow.map((extra, index) => (
                    <label
                      key={index}
                      className="extra-option pl-5"
                      style={{ color: darkMode ? "#fff" : "#222" }}
                    >
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
                <div
                  className="meat-selector"
                  style={{ color: darkMode ? "#fff" : "#222" }}
                >
                  <h4>Quantidade de carnes</h4>
                  <button
                    onClick={() =>
                      setMeatCount((prev) =>
                        Math.max(product.meatOptions.min, prev - 1)
                      )
                    }
                  >
                    -
                  </button>
                  <span>{meatCount}</span>
                  <button
                    onClick={() =>
                      setMeatCount((prev) =>
                        Math.min(product.meatOptions.max, prev + 1)
                      )
                    }
                  >
                    +
                  </button>
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
                className="outline-none"
                placeholder="Alguma observação sobre o pedido?"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  borderRadius: "5px",
                  background: darkMode ? "#333" : "#f9f9f9",
                  color: darkMode ? "#fff" : "#222",
                  border: darkMode ? "1px solid #555" : "1px solid #ccc",
                  resize: "none",
                }}
              />
            </div>
          </div>
        </div>

        <div
          className="modal-footer flex items-center justify-between"
          style={{
            background: darkMode ? "#1f1f1f" : "#f9f9f9",
            color: darkMode ? "#fff" : "#222",
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setProductQuantity((prev) => Math.max(1, prev - 1))
              }
              style={{
                background: "transparent",
                color: darkMode ? "#fff" : "#222",
                cursor: "pointer",
              }}
            >
              -
            </button>
            <span>{productQuantity}</span>
            <button
              onClick={() => setProductQuantity((prev) => prev + 1)}
              style={{
                background: "transparent",
                color: darkMode ? "#fff" : "#222",
                cursor: "pointer",
              }}
            >
              +
            </button>
          </div>
          <button
            className="btn-add-cart"
            type="button"
            onClick={handleAddOrUpdate}
            style={{
              background: darkMode ? "#444" : "#4CAF50",
              color: "#fff",
            }}
          >
            {isEdit
              ? "Atualizar Pedido"
              : `Adicionar ao carrinho - R$ ${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductModal);
