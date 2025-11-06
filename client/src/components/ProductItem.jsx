import { memo, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import "../styles/ProductItem.css";

const ProductItem = ({ name, price, image, description }) => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div
      className="product-card"
      style={{
        background: darkMode ? "#222" : "#fff",
        color: darkMode ? "#fff" : "#222",
        boxShadow: darkMode ? "none" : "0 2px 8px 0 rgba(0,0,0,0.12)",
        border: darkMode ? "1px solid #444" : "1px solid #eee",
        transition: "0.3s",
      }}
    >
      <div className="product-img-wrap">
        <img src={image} alt={name} className="product-img" />
      </div>

      <h4
        className="product-name"
        style={{ color: darkMode ? "#fff" : "#222" }}
      >
        {name}
      </h4>

      <p
        className="product-description"
        style={{ color: darkMode ? "#ccc" : "#555" }}
      >
        {description}
      </p>

      <p className="product-price">R$ {price?.toFixed(2)}</p>
    </div>
  );
};

export default memo(ProductItem);
