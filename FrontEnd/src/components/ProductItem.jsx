import { memo } from "react";

import "../styles/ProductItem.css"

const ProductItem = ({ name, price, image, description }) => {
  return (
    <div className="product-card">
      <div className="product-img-wrap">
        <img src={image} alt={name} className="product-img" />
      </div>
      <h4 className="product-name">{name}</h4>
      <p className="product-description">{description}</p>
      <p className="product-price">R$ {price.toFixed(2)}</p>
    </div>
  );
};

export default memo(ProductItem);
