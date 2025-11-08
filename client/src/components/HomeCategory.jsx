import { memo, useState, useEffect, useContext, useRef } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { SearchContext } from "../context/SearchProvider";
import ProductItem from "./ProductItem";
import SearchItem from "./SearchItem";
import Loading from "../components/Loading";
import { getImageUrl } from "../services/config";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "../styles/HomeCategory.css";

const HomeCategory = ({
  onOpenProductModal,
  onSelectCategory,
  productIdFromURL,
  selectedCategoryId,
}) => {
  const { darkMode } = useContext(ThemeContext);
  const { searchItem, setSearchItem } = useContext(SearchContext);

  const [selectedCategory, setSelectedCategory] = useState(
    selectedCategoryId || ""
  );
  const {
    categories,
    loading: loadingCategories,
    refresh: refreshCategories,
  } = useCategories();
  const {
    products,
    loading: loadingProducts,
    fetchByCategory,
    fetchAll,
  } = useProducts();

  const initialized = useRef(false);
  const initialLoadDone = useRef(false); // ✅ controla modal da URL

  // -------------------- FETCH CATEGORIES --------------------
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      try {
        const data = await refreshCategories();
        if (data.length > 0 && !selectedCategory) {
          const firstId = data[0]._id;
          setSelectedCategory(firstId);
          if (!selectedCategoryId) onSelectCategory?.(firstId);
        }
      } catch (err) {
        console.error("Erro ao iniciar categorias:", err);
      }
    };

    init();
  }, [refreshCategories]);

  // -------------------- FETCH PRODUCTS --------------------
  const fetchProductsForCategory = async (categoryId) => {
    if (!categoryId) return;
    try {
      const data = await fetchByCategory(categoryId);

      // Abrir modal apenas na inicialização com URL
      if (productIdFromURL && !initialLoadDone.current) {
        const product = data.find((p) => p._id === productIdFromURL);
        if (product) {
          initialLoadDone.current = true;
          onOpenProductModal?.(product);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar produtos por categoria:", err);
    }
  };

  const fetchAllProducts = async () => {
    try {
      await fetchAll();
    } catch (err) {
      console.error("Erro ao buscar todos os produtos:", err);
    }
  };

  // Fetch products para a categoria selecionada
  useEffect(() => {
    if (!selectedCategory) return;
    if (searchItem.trim() !== "") return;
    fetchProductsForCategory(selectedCategory);
  }, [selectedCategory, searchItem]);

  // Quando muda a busca
  useEffect(() => {
    if (searchItem.trim() === "") {
      if (selectedCategory) fetchProductsForCategory(selectedCategory);
    } else {
      fetchAllProducts();
    }
  }, [searchItem, selectedCategory]);

  // -------------------- FILTRO DE SEARCH --------------------
  const displayedProducts =
    searchItem.trim() === ""
      ? products
      : products.filter(
          (p) =>
            p.name.toLowerCase().includes(searchItem.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchItem.toLowerCase())
        );

  return (
    <section
      className="home-category"
      style={{
        backgroundColor: darkMode ? "#1a1a1a" : "#f5f5f5",
        minHeight: "100vh",
        padding: "1rem 0",
      }}
    >
      {/* Categorias */}
      <div
        className="home-cat-slider"
        style={{ maxWidth: 1200, margin: "1.5rem auto" }}
      >
        {loadingCategories ? (
          <Loading text="Carregando categorias..." />
        ) : (
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
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <button
                  type="button"
                  className="cat-card"
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    onSelectCategory?.(cat._id);
                    setSearchItem("");
                    // ⚠️ não abrir modal automaticamente ao clicar
                  }}
                  style={{
                    background:
                      selectedCategory === cat._id
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
                    <img
                      src={getImageUrl(cat.image)}
                      alt={cat.name}
                      className="cat-img"
                    />
                  </div>
                  <h3 className="cat-title">{cat.name}</h3>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Search */}
      <div style={{ maxWidth: 600, margin: "1.5rem auto" }}>
        <SearchItem />
      </div>

      {/* Lista de produtos */}
      <div
        id="product-list"
        className="product-list"
        style={{
          background: darkMode ? "#1a1a1a" : "#f5f5f5",
        }}
      >
        {loadingProducts ? (
          <Loading text="Carregando produtos..." />
        ) : displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => onOpenProductModal?.(product)}
              style={{ cursor: "pointer" }}
            >
              <ProductItem {...product} image={getImageUrl(product.image)} />
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
    </section>
  );
};

export default memo(HomeCategory);
