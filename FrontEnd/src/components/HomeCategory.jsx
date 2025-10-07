import { memo, useState, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";

import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import ProductItem from "./ProductItem";
import ProductModal from "./ProductModal";
import SearchItem from "./SearchItem";

import "../styles/HomeCategory.css";
import categories from "../services/categories";
import productsByCategory from "../services/productsByCategory";

const HomeCategory = () => {
  const { darkMode } = useContext(ThemeContext);
  const { searchItem = "", setSearchItem } = useContext(AuthContext);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].title);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const allProducts = categories.flatMap((cat) =>
    (productsByCategory[cat.title] || []).map((product) => ({
      ...product,
      category: cat.title,
    }))
  );

  const displayedProducts =
    (searchItem || "").trim() === ""
      ? productsByCategory[selectedCategory] || []
      : allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchItem.toLowerCase()) ||
            product.category.toLowerCase().includes(searchItem.toLowerCase())
        );

  return (
    <section
      className="home"
      style={{
        backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Categorias em Swiper */}
      <div
        className="home-cat-slider"
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "1200px",
          margin: "1.5rem auto",
          width: "100%",
        }}
      >
        <Swiper
          spaceBetween={10}
          slidesPerView={2}
          breakpoints={{
            320: { slidesPerView: 1 },
            420: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
            900: { slidesPerView: 4 },
            1200: { slidesPerView: 5 },
          }}
          freeMode
          mousewheel={{ forceToAxis: true }}
          grabCursor
          loop
          autoplay={{ delay: 1500, disableOnInteraction: false }}
          speed={2000}
          modules={[FreeMode, Mousewheel, Autoplay, Navigation]}
          style={{ width: "100%" }}
        >
          {categories.map((cat) => (
            <SwiperSlide key={cat.id}>
              <button
                type="button"
                className="cat-card"
                aria-label={cat.title}
                onClick={() => {
                  setSelectedCategory(cat.title);
                  setSearchItem("");
                }}
                style={{
                  background:
                    selectedCategory === cat.title
                      ? darkMode
                        ? "#333"
                        : "#f8f8f8"
                      : darkMode
                      ? "#222"
                      : "#fff",
                  color: darkMode ? "#fff" : "#222",
                  border: darkMode ? "1px solid #444" : "1px solid #eee",
                }}
              >
                <div className="cat-img-wrap">
                  <img src={cat.img} alt={cat.title} className="cat-img" />
                </div>
                <h3
                  className="cat-title"
                  style={{ color: darkMode ? "#fff" : "#222" }}
                >
                  {cat.title}
                </h3>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Search */}
      <div
        className="flex justify-center w-full my-6"
        style={{ maxWidth: "600px", margin: "1.5rem auto" }}
      >
        <SearchItem />
      </div>

      {/* Lista de produtos */}
      <div
        className="product-list"
        style={{
          background: darkMode ? "#1a1a1a" : "#f5f5f5",
          color: darkMode ? "#fff" : "#222",
        }}
      >
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div key={product.id} onClick={() => setSelectedProduct(product)}>
              <ProductItem {...product} />
            </div>
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              padding: "2rem",
              color: darkMode ? "#aaa" : "#555",
            }}
          >
            Nenhum produto encontrado.
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
};

export default memo(HomeCategory);
