import { memo, useState } from "react";
import ProductItem from "./ProductItem";

import "../styles/HomeCategory.css"
import categories from "../services/categories";
import productsByCategory from "../services/productsByCategory";
import ProductModal from "./ProductModal";

const HomeCategory = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].title);
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <>
      <div className="home-cat-slider">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-card ${
              selectedCategory === cat.title ? "selected" : ""
            }`}
            aria-label={cat.title}
            onClick={() => setSelectedCategory(cat.title)}
          >
            <div className="cat-img-wrap">
              <img src={cat.img} alt={cat.title} className="cat-img" />
            </div>
            <h3 className="cat-title">{cat.title}</h3>
          </button>
        ))}
      </div>
      {/* Lista de produtos */}
      <div className="product-list">
        {productsByCategory[selectedCategory]?.map((product) => (
          <div key={product.id} onClick={() => setSelectedProduct(product)}>
            <ProductItem {...product} />
          </div>
        ))}
      </div>
      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default memo(HomeCategory);
