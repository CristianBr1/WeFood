import { memo, useState, useEffect, useRef, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomeSlider from "../components/HomeSlider";
import HomeCategory from "../components/HomeCategory";
import HomeProductModal from "../components/HomeProductModal";
import Footer from "../components/Footer";
import { useProducts } from "../hooks/useProducts";
import { ThemeContext } from "../context/ThemeProvider";
import { Box } from "@mui/material";

const Home = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { getProductById } = useProducts();
  const { darkMode } = useContext(ThemeContext);

  const [modalProduct, setModalProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const modalOpenedRef = useRef(false);

  /** =============================
   *   Abrir modal com produto
   * ============================= */
  const openProductModal = async (product) => {
    try {
      const full =
        product.extras && product.meatOptions
          ? product
          : await getProductById(product._id);

      setModalProduct(full);
      modalOpenedRef.current = true;
      window.history.pushState(null, "", `/product/${full._id}`);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
    }
  };

  /** =============================
   *   Fechar modal
   * ============================= */
  const closeModal = () => {
    setModalProduct(null);
    modalOpenedRef.current = false;

    if (selectedCategoryId) {
      window.history.pushState(null, "", `/category/${selectedCategoryId}`);
    } else {
      window.history.pushState(null, "", "/");
    }
  };

  /** =============================
   *   Selecionar categoria
   * ============================= */
  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    window.history.pushState(null, "", `/category/${categoryId}`);
  };

  /** =============================
   *   Detectar URL para abrir modal
   * ============================= */
  useEffect(() => {
    const parts = location.pathname.split("/");

    if (parts[1] === "category") {
      setSelectedCategoryId(parts[2]);
    }

    if (parts[1] === "product" && !modalOpenedRef.current) {
      const id = parts[2];
      if (id) {
        modalOpenedRef.current = true;
        getProductById(id)
          .then((full) => full && setModalProduct(full))
          .catch((err) => console.error(err));
      }
    }
  }, [location.pathname, getProductById]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        transition: "0.2s",
      }}
    >
      <Navbar />

      {/* SLIDER CENTRALIZADO */}
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <Box sx={{ width: "100%", maxWidth: "1200px" }}>
          <HomeSlider />
        </Box>
      </Box>

      {/* LISTA DE CATEGORIAS + PRODUTOS */}
      <Box sx={{ width: "100%" }}>
        <HomeCategory
          onOpenProductModal={openProductModal}
          onSelectCategory={selectCategory}
          productIdFromURL={modalProduct?._id || productId}
          selectedCategoryId={selectedCategoryId}
        />
      </Box>

      {/* MODAL DO PRODUTO */}
      {modalProduct && (
        <HomeProductModal product={modalProduct} onClose={closeModal} />
      )}

      <Footer />
    </Box>
  );
};

export default memo(Home);
