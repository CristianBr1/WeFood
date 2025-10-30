import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";

const Categories = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/categories", {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if (!res.ok) throw new Error("Erro ao carregar categorias");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta categoria?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir categoria");
      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    const newName = window.prompt("Editar nome da categoria:", category.name);
    if (!newName) return;

    // Atualiza backend
    fetch(`/api/categories/${category.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token ? `Bearer ${user.token}` : "",
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao atualizar categoria");
        setCategories(
          categories.map((c) => (c.id === category.id ? { ...c, name: newName } : c))
        );
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Categorias</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {loading ? (
        <p>Carregando categorias...</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Nome</th>
              <th className="p-2 border-b">Imagem</th>
              <th className="p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className={darkMode ? "bg-gray-800 border-b border-gray-700" : "border-b"}>
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">
                  {c.image ? <img src={c.image} alt={c.name} className="w-12 h-12 object-cover rounded" /> : "-"}
                </td>
                <td className="p-2 flex gap-2">
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => handleEdit(c)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(c.id)}
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

export default Categories;
