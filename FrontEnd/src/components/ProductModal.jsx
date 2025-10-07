import { memo, useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import { ThemeContext } from "../context/ThemeProvider";
import "../styles/ProductModal.css";

const ProductModal = ({ product, onClose, isEdit }) => {
  if (!product) return null;

  const { darkMode } = useContext(ThemeContext);
  const { addToCart, updateCartItem } = useContext(AuthContext);

  const [selectedExtras, setSelectedExtras] = useState([]);
  const [meatCount, setMeatCount] = useState(product.meatOptions?.min || 1);
  const [productQuantity, setProductQuantity] = useState(1);
  const [observations, setObservations] = useState("");

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
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    );
  };

  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
  const meatExtraPrice = (meatCount - 1) * 5;
  const totalPrice = (product.price + extrasTotal + meatExtraPrice) * productQuantity;

  const handleAddOrUpdate = () => {
    const itemData = {
      ...product,
      extras: selectedExtras,
      meatCount,
      quantity: productQuantity,
      observations,
      totalPrice,
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
        zIndex: 1000
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
        {/* Botão fechar */}
        <button
          className="close-button"
          onClick={onClose}
          style={{ background: "transparent" }}
        >
          <CloseIcon className="text-red-600" />
        </button>

        {/* Conteúdo do produto */}
        <div className="modal-contents" style={{ color: darkMode ? "#fff" : "#222" }}>
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-info">
            <div className="modal-header" style={{ color: darkMode ? "#fff" : "#222" }}>
              {product.name}
            </div>

            <div className="modal-body">
              <p>{product.description}</p>

              {/* Extras */}
              {product.extras?.length > 0 && (
                <div>
                  <h4>Extras</h4>
                  {product.extras.map((extra, index) => (
                    <label key={index} className="extra-option pl-5" style={{ color: darkMode ? "#fff" : "#222" }}>
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra)}
                        onChange={() => toggleExtra(extra)}
                      />
                      {extra.name} (+ R$ {extra.price.toFixed(2)})
                    </label>
                  ))}
                </div>
              )}

              {/* Carnes */}
              {product.meatOptions && (
                <div className="meat-selector" style={{ color: darkMode ? "#fff" : "#222" }}>
                  <h4>Quantidade de carnes</h4>
                  <button onClick={() => setMeatCount(prev => Math.max(product.meatOptions.min, prev - 1))}>-</button>
                  <span>{meatCount}</span>
                  <button onClick={() => setMeatCount(prev => Math.min(product.meatOptions.max, prev + 1))}>+</button>
                  {meatCount > 1 && (
                    <p className="extra-meat-price">
                      + R$ {(product.meatOptions.pricePerExtra * (meatCount - 1)).toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              {/* Observações */}
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

        {/* Rodapé com quantidade e adicionar ao carrinho */}
        <div
          className="modal-footer flex items-center justify-between"
          style={{
            background: darkMode ? "#1f1f1f" : "#f9f9f9",
            color: darkMode ? "#fff" : "#222",
          }}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setProductQuantity(prev => Math.max(1, prev - 1))}
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
              onClick={() => setProductQuantity(prev => prev + 1)}
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
            {isEdit ? "Atualizar Pedido" : `Adicionar ao carrinho - R$ ${totalPrice.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductModal);
