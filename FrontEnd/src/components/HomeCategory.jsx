import { memo, useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import ProductItem from "./ProductItem";

import "../styles/HomeCategory.css"
import categories from "../services/categories";
import productsByCategory from "../services/productsByCategory";
import ProductModal from "./ProductModal";

const HomeCategory = () => {
  const { darkMode } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].title);
  const [selectedProduct, setSelectedProduct] = useState(null);
  return (
    <>
    <section className="home" style={{
      backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
      minHeight: "100vh",
    }}>
      <div
        className="home-cat-slider"
        style={{
          background: darkMode ? "#1a1a1a" : "#f5f5f5",
          color: darkMode ? "#fff" : "#222",
          marginTop: "60px",
        }}
        >
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`cat-card ${selectedCategory === cat.title ? "selected" : ""}`}
            aria-label={cat.title}
            onClick={() => setSelectedCategory(cat.title)}
            style={{
              background: darkMode
              ? selectedCategory === cat.title ? "#333" : "#222"
              : selectedCategory === cat.title ? "#f8f8f8" : "#fff",
              color: darkMode ? "#fff" : "#222",
              border: darkMode ? "1px solid #444" : "1px solid #eee"
            }}
          >
            <div className="cat-img-wrap">
              <img src={cat.img} alt={cat.title} className="cat-img" />
            </div>
            <h3 className="cat-title" style={{
              color: darkMode ? "#fff" : "#222",
            }}>{cat.title}</h3>
          </button>
        ))}
      </div>
      {/* Lista de produtos */}
      <div
        className="product-list"
        style={{
          background: darkMode ? "#1a1a1a" : "#f5f5f5",
          color: darkMode ? "#fff" : "#222",
        }}
        >
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
      </section>
    </>
  );
};

export default memo(HomeCategory);
