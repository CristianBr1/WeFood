import React, { useContext } from "react";
import Button from "@mui/material/Button";
import { ThemeContext } from "../context/ThemeProvider";

import { getImageUrl } from "../services/config";

const ViewProductModal = ({ product, onClose }) => {
  const { darkMode } = useContext(ThemeContext);

  if (!product) return null;

  return (
    <div
      className="modal-overlay fixed inset-0 flex justify-center items-center z-50"
      style={{
        background: darkMode ? "rgba(34,34,34,0.85)" : "rgba(0,0,0,0.4)",
      }}
      onClick={onClose}
    >
      <div
        className="modal p-6 rounded-md shadow-md relative w-full max-w-lg flex flex-col gap-4"
        style={{
          background: darkMode ? "#222" : "#fff",
          color: darkMode ? "#fff" : "#222",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-2">{product.name}</h2>

        {product.image && (
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-48 object-cover rounded mb-2"
          />
        )}

        <div className="flex flex-col gap-2">
          <p>
            <strong>Categoria:</strong> {product.category?.name || "-"}
          </p>
          <p>
            <strong>Preço:</strong> R$ {product.price?.toFixed(2)}
          </p>

          {product.extras?.length > 0 && (
            <p>
              <strong>Extras:</strong>{" "}
              {product.extras
                .map((e) => `${e.name} (R$ ${e.price})`)
                .join(", ")}
            </p>
          )}

          {product.meatOptions?.enabled && (
            <p>
              <strong>Opções de Carne:</strong>{" "}
              {`min: ${product.meatOptions.min}, max: ${product.meatOptions.max}, preço extra: R$ ${product.meatOptions.pricePerExtra}`}
            </p>
          )}

          {product.description && (
            <p>
              <strong>Descrição:</strong> {product.description}
            </p>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <Button variant="contained" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
