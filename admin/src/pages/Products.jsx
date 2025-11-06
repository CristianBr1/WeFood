import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import { Box, Typography, Button } from "@mui/material";
import ProductModal from "../components/ProductModal";
import ViewProductModal from "../components/ViewProductModal";
import Loading from "../components/Loading";
import { ProductService } from "../services/endpoints/product.Service";
import { CategoryService } from "../services/endpoints/category.Service";

const Products = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  // 🔹 Carregar categorias e produtos
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          CategoryService.getCategories(),
          ProductService.getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        setError(err.message || "Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // 🔹 Atualizar lista de produtos
  const refreshProducts = async () => {
    try {
      const updated = await ProductService.getProducts();
      setProducts(updated);
    } catch (err) {
      console.error("Erro ao atualizar produtos:", err);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await ProductService.deleteProduct(_id);
      setProducts((prev) => prev.filter((p) => p._id !== _id));
    } catch (err) {
      setError(err.message || "Erro ao excluir produto");
    }
  };

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category?._id === filterCategory)
    : products;

  if (loading) return <Loading text="Carregando produtos..." />;

  return (
    <div
      className={`p-6 rounded-md shadow-md ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h2 className="text-2xl font-bold mb-4">Produtos</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* Filtro de categoria */}
      <div className="mb-4 flex items-center gap-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={`p-2 rounded ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
          }`}
        >
          <option value="">Todas as Categorias</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <Button variant="contained" onClick={() => setFilterCategory("")}>
          Limpar filtro
        </Button>
      </div>

      {/* Lista de produtos */}
      {filteredProducts.length === 0 ? (
        <Typography color="textSecondary">
          Nenhum produto encontrado.
        </Typography>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredProducts.map((p, index) => (
            <div
              key={p._id}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg shadow cursor-pointer ${
                darkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleView(p)}
            >
              <div className="flex items-center gap-4">
                {p.image ? (
                  <img
                    src={
                      p.image.startsWith("http")
                        ? p.image
                        : `http://localhost:8000${p.image}`
                    }
                    alt={p.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                    -
                  </div>
                )}

                <div className="flex flex-col">
                  <p className="font-semibold">
                    {index + 1}. {p.name}
                  </p>
                  <p className="text-sm">{p.category?.name}</p>
                  <p className="text-sm font-medium">
                    R$ {p.price?.toFixed(2)}
                  </p>

                  {p.extras?.length > 0 && (
                    <p className="text-sm">
                      <strong>Extras:</strong>{" "}
                      {p.extras
                        .map((e) => `${e.name} (R$ ${e.price})`)
                        .join(", ")}
                    </p>
                  )}

                  {p.meatOptions?.enabled && (
                    <p className="text-sm">
                      <strong>Opções de Carne:</strong> min: {p.meatOptions.min}
                      , max: {p.meatOptions.max}, preço extra: R${" "}
                      {p.meatOptions.pricePerExtra}
                    </p>
                  )}

                  {p.description && (
                    <p className="text-sm">
                      <strong>Descrição:</strong> {p.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Botões Editar/Excluir */}
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant="contained"
                  size="small"
                  color="success"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(p);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p._id);
                  }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edição/adicionar */}
      {modalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setModalOpen(false)}
          isEdit={isEdit}
          categories={categories}
          refreshProducts={refreshProducts}
        />
      )}

      {/* Modal de visualização */}
      {viewModalOpen && (
        <ViewProductModal
          product={selectedProduct}
          onClose={() => setViewModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Products;
