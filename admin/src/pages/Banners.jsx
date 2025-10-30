import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";

const Banners = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/banners", {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if (!res.ok) throw new Error("Erro ao carregar banners");
        const data = await res.json();
        setBanners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este banner?")) return;
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir banner");
      setBanners(banners.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (banner) => {
    const newTitle = window.prompt("Editar título do banner (opcional):", banner.title || "");
    if (newTitle === null) return;

    fetch(`/api/banners/${banner.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: user?.token ? `Bearer ${user.token}` : "",
      },
      body: JSON.stringify({ title: newTitle }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao atualizar banner");
        setBanners(
          banners.map((b) => (b.id === banner.id ? { ...b, title: newTitle } : b))
        );
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Banners da Home</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {loading ? (
        <p>Carregando banners...</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Título</th>
              <th className="p-2 border-b">Imagem</th>
              <th className="p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((b) => (
              <tr key={b.id} className={darkMode ? "bg-gray-800 border-b border-gray-700" : "border-b"}>
                <td className="p-2">{b.id}</td>
                <td className="p-2">{b.title || "-"}</td>
                <td className="p-2">
                  {b.image ? <img src={b.image} alt={b.title || "Banner"} className="w-24 h-12 object-cover rounded" /> : "-"}
                </td>
                <td className="p-2 flex gap-2">
                  <Button
                    variant="contained"
                    size="small"
                    color="success"
                    onClick={() => handleEdit(b)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(b.id)}
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

export default Banners;
