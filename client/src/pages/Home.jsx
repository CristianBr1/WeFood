import { memo, useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import HomeSlider from "../components/HomeSlider";
import HomeCategory from "../components/HomeCategory";
import HomeProductModal from "../components/HomeProductModal";

const Home = () => {
  const { id: productIdFromURL } = useParams(); 
  const location = useLocation();

  const [modalProduct, setModalProduct] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // -------------------- PRODUTO --------------------
  const openProductModal = (product) => {
    setModalProduct(product);
    window.history.pushState(null, "", `/product/${product._id}`);
  };

  const closeModal = () => {
    setModalProduct(null);
    if (selectedCategoryId) {
      window.history.pushState(null, "", `/category/${selectedCategoryId}`);
    } else {
      window.history.pushState(null, "", "/");
    }
  };

  // -------------------- CATEGORIA --------------------
  const selectCategory = (categoryId) => {
    setSelectedCategoryId(categoryId);
    window.history.pushState(null, "", `/category/${categoryId}`);
  };

  // -------------------- Inicializa categoria e produto da URL --------------------
  useEffect(() => {
    const pathParts = location.pathname.split("/");

    if (pathParts[1] === "category") {
      setSelectedCategoryId(pathParts[2]);
    }

    if (pathParts[1] === "product") {
      // O HomeCategory lidará com abrir o modal
      setModalProduct(null);
    }
  }, [location.pathname]);

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
          productIdFromURL={modalProduct?.id || productIdFromURL}
          selectedCategoryId={selectedCategoryId}
        />
      </div>

      {modalProduct && (
        <HomeProductModal
          product={modalProduct}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default memo(Home);
