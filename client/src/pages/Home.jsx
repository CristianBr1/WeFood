import { memo, useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomeSlider from "../components/HomeSlider";
import HomeCategory from "../components/HomeCategory";
import HomeProductModal from "../components/HomeProductModal";
import { useProducts } from "../hooks/useProducts";
import Footer from "../components/Footer";

const Home = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { getProductById } = useProducts();

  const [modalProduct, setModalProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const modalOpenedRef = useRef(false);

  // Abrir modal com produto completo
  const openProductModal = async (product) => {
    try {
      const full = product.extras && product.meatOptions ? product : await getProductById(product._id);
      setModalProduct(full);
      modalOpenedRef.current = true;
      window.history.pushState(null, "", `/product/${full._id}`);
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
    }
  };

  const closeModal = () => {
    setModalProduct(null);
    modalOpenedRef.current = false;
    if (selectedCategoryId) {
      window.history.pushState(null, "", `/category/${selectedCategoryId}`);
    } else {
      window.history.pushState(null, "", "/");
    }
  };

  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    window.history.pushState(null, "", `/category/${categoryId}`);
  };

  // Inicializa modal a partir da URL
  useEffect(() => {
    const pathParts = location.pathname.split("/");

    if (pathParts[1] === "category") {
      setSelectedCategoryId(pathParts[2]);
    }

    if (pathParts[1] === "product" && !modalOpenedRef.current) {
      const id = pathParts[2];
      if (id) {
        modalOpenedRef.current = true;
        getProductById(id)
          .then((full) => { if (full) setModalProduct(full); })
          .catch((err) => console.error(err));
      }
    }
  }, [location.pathname, getProductById]);

  return (
    <div className="Home">
      <Navbar />
      <div className="flex justify-center w-full my-6">
        <div className="w-full max-w-[1200px]">
          <HomeSlider />
        </div>
      </div>

      <div className="w-full">
        <HomeCategory
          onOpenProductModal={openProductModal}
          onSelectCategory={selectCategory}
          productIdFromURL={modalProduct?._id || productId}
          selectedCategoryId={selectedCategoryId}
        />
      </div>

      {modalProduct && (
        <HomeProductModal product={modalProduct} onClose={closeModal} />
      )}
      <Footer />
    </div>
  );
};

export default memo(Home);
