import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const Products = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Carregar produtos e categorias
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar categorias
        const catRes = await fetch("/api/categories", {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if (!catRes.ok) throw new Error("Erro ao carregar categorias");
        const catData = await catRes.json();
        setCategories(catData);

        // Buscar produtos
        const prodRes = await fetch("/api/products", {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if (!prodRes.ok) throw new Error("Erro ao carregar produtos");
        const prodData = await prodRes.json();
        setProducts(prodData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir produto");
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Produtos filtrados por categoria
  const filteredProducts = filterCategory
    ? products.filter((p) => p.categoryId === filterCategory)
    : products;

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Produtos</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <div className="mb-4 flex items-center gap-4">
        <Select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          displayEmpty
          className={darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"}
        >
          <MenuItem value="">Todas as Categorias</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          onClick={() => setFilterCategory("")}
        >
          Limpar filtro
        </Button>
      </div>

      {loading ? (
        <p>Carregando produtos...</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Nome</th>
              <th className="p-2 border-b">Categoria</th>
              <th className="p-2 border-b">Preço</th>
              <th className="p-2 border-b">Extras</th>
              <th className="p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className={darkMode ? "bg-gray-800 border-b border-gray-700" : "border-b"}>
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{categories.find((c) => c.id === p.categoryId)?.name}</td>
                <td className="p-2">{p.price?.toFixed(2)}</td>
                <td className="p-2">
                  {p.extras?.length > 0 ? p.extras.map((e) => e.name).join(", ") : "-"}
                </td>
                <td className="p-2 flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => alert(JSON.stringify(p, null, 2))}
                  >
                    Visualizar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => alert("Funcionalidade de editar ainda não implementada")}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(p.id)}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Products;
