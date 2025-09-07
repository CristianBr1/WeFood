import { memo, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";

import "../styles/ProductModal.css";

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;


  const [selectedExtras, setSelectedExtras] = useState([]);
  const [meatCount, setMeatCount] = useState(product.meatOptions?.min || 1);
  const [productQuantity, setProductQuantity] = useState(1);
  const [observations, setObservations] = useState("");

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    );
  };

  const extrasTotal = selectedExtras.reduce(
    (sum, extra) => sum + extra.price,
    0
  );
  const meatExtraPrice = (meatCount - 1) * 5;
  const totalPrice =
    (product.price + extrasTotal + meatExtraPrice) * productQuantity;

  const { addToCart } = useContext(AuthContext);

  const handleAddToCart = () => {
    addToCart({
      ...product,
      extras: selectedExtras,
      meatCount,
      quantity: productQuantity,
      observations,
      totalPrice,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <CloseIcon className="text-red-600" />
        </button>

        <div className="modal-contents">
          <div className="product-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-info">
            <div className="modal-header">{product.name}</div>
            <div className="modal-body">
              <p>{product.description}</p>

              {/* Seção Extras */}
              {product.extras?.length > 0 && (
                <div>
                  <h4>Extras</h4>
                  {product.extras?.map((extra, index) => (
                    <label key={index} className="extra-option pl-5">
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

              {/* Seleção de Carnes */}
              {product.meatOptions && (
                <div className="meat-selector">
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

        {/* Rodapé com quantidade de produto e preço total */}
        <div className="modal-footer flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setProductQuantity((prev) => Math.max(1, prev - 1))
              }
            >
              -
            </button>
            <span>{productQuantity}</span>
            <button onClick={() => setProductQuantity((prev) => prev + 1)}>
              +
            </button>
          </div>
          <button
            className="btn-add-cart"
            type="button"
            onClick={handleAddToCart}
          >
            Adicionar ao carrinho - R$ {totalPrice.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductModal);
