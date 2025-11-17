import { memo, useState, useEffect, useContext, useMemo } from "react";
import { getImageUrl } from "../services/config";
import { ThemeContext } from "../context/ThemeProvider";
import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useCartContext } from "../hooks/useCartContext";
import "../styles/ProductModal.css";

const CartProductModal = ({ item, onClose, onUpdate }) => {
  const { darkMode } = useContext(ThemeContext);
  const { updateItem } = useCartContext();

  if (!item) return null;

  const allExtras = item.originalExtras || [];

  const [selectedExtras, setSelectedExtras] = useState([]);
  const [meatCount, setMeatCount] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  // Carrega estado inicial do item
  useEffect(() => {
    setSelectedExtras(
      Array.isArray(item.extras)
        ? item.extras.map((e) => ({ name: e.name, price: e.price }))
        : []
    );

    setMeatCount(item.meatCount || 1);
    setQuantity(item.quantity || 1);
    setObservations(item.observations || "");
  }, [item]);

  // Alterna seleção de extras
  const toggleExtra = (extra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.name === extra.name)
        ? prev.filter((e) => e.name !== extra.name)
        : [...prev, { name: extra.name, price: extra.price }]
    );
  };

  // Cálculo único e memoizado
  const { unitPrice, totalPrice } = useMemo(() => {
    const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
    const extraMeatTotal =
      (meatCount - 1) * (item.meatOptions?.pricePerExtra || 0);

    const unit = item.price + extrasTotal + extraMeatTotal;
    return {
      unitPrice: unit,
      totalPrice: unit * quantity,
    };
  }, [selectedExtras, meatCount, quantity, item]);

  // Atualiza o item no carrinho
  const handleUpdate = async () => {
    await updateItem(item.cartItemId, {
      quantity,
      extras: selectedExtras,
      meatCount,
      observations,
      unitPrice,
      totalPrice,
    });

    onUpdate && onUpdate();
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
        {/* Botão de fechar */}
        <IconButton
          onClick={onClose}
          size="large"
          sx={{
            position: "absolute",
            top: 10,
            right: { xs: "50%", md: 10 },
            transform: { xs: "translateX(50%)", md: "none" },
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
          <div className="product-image">
            {item.image && <img src={getImageUrl(item.image)} alt={item.name} />}
          </div>

          <div className="product-info">
            <div className="modal-header">{item.name}</div>
            <div className="modal-body">
              <p>{item.description}</p>

              {/* EXTRAS */}
              {allExtras.length > 0 && (
                <div>
                  <h4>Extras</h4>
                  {allExtras.map((extra, idx) => (
                    <label key={idx} className="extra-option pl-5">
                      <input
                        type="checkbox"
                        checked={selectedExtras.some(
                          (e) => e.name === extra.name
                        )}
                        onChange={() => toggleExtra(extra)}
                      />
                      {extra.name} (+ R$ {(extra.price || 0).toFixed(2)})
                    </label>
                  ))}
                </div>
              )}

              {/* Carnes */}
              {item.meatOptions && (
                <div className="meat-selector">
                  <h4>Quantidade de carnes</h4>

                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() =>
                      setMeatCount((prev) =>
                        Math.max(item.meatOptions.min || 1, prev - 1)
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
                        Math.min(item.meatOptions.max || 3, prev + 1)
                      )
                    }
                  >
                    +
                  </Button>

                  {meatCount > 1 && (
                    <p className="extra-meat-price">
                      + R${" "}
                      {(
                        (meatCount - 1) *
                        (item.meatOptions.pricePerExtra || 0)
                      ).toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              {/* Observações */}
              <h4>Observações</h4>
              <textarea
                placeholder="Alguma observação sobre o pedido?"
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <div className="quantity-controls">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </Button>
            <span>{quantity}</span>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </Button>
          </div>

          <Button
            className="add-cart-btn"
            variant="contained"
            color="success"
            onClick={handleUpdate}
          >
            Atualizar Pedido - R$ {totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default memo(CartProductModal);
