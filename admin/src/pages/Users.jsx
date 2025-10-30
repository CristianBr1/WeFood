import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import Button from "@mui/material/Button";

const Users = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/users", {
          headers: {
            Authorization: user?.token ? `Bearer ${user.token}` : "",
          },
        });
        if (!res.ok) throw new Error("Erro ao carregar usuários");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  // Excluir usuário
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: user?.token ? `Bearer ${user.token}` : "",
        },
      });
      if (!res.ok) throw new Error("Erro ao excluir usuário");
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} rounded-md shadow-md`}>
      <h2 className="text-2xl font-bold mb-4">Usuários Cadastrados</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <table className="w-full border border-gray-300 rounded-md overflow-hidden">
          <thead className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
            <tr>
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Nome</th>
              <th className="p-2 border-b">Email</th>
              <th className="p-2 border-b">Role</th>
              <th className="p-2 border-b">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className={darkMode ? "bg-gray-800 border-b border-gray-700" : "border-b"}>
                <td className="p-2">{u.id}</td>
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => alert(JSON.stringify(u, null, 2))}
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
                    onClick={() => handleDelete(u.id)}
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

export default Users;
