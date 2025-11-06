import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import { Typography, Button } from "@mui/material";
import Loading from "../components/Loading";
import { UserService } from "../services/endpoints/user.Service";

const Users = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // 🔹 Função segura para pegar o ID
  const getId = (u) => {
    if (!u._id) return undefined;
    return typeof u._id === "string" ? u._id : u._id.$oid;
  };

  // 🔹 Carregar usuários
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        const data = await UserService.getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message || "Erro ao carregar usuários");
      } finally {
        setLoading(false);
      }
    };
    fetchUsersData();
  }, []);

  // 🔹 Excluir usuário
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await UserService.deleteUser(id);
      setUsers((prev) => prev.filter((u) => getId(u) !== id));
    } catch (err) {
      setError(err.message || "Erro ao excluir usuário");
    }
  };

  // 🔹 Visualizar usuário
  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  if (loading) return <Loading text="Carregando usuários..." />;

  return (
    <div className={`p-6 rounded-md shadow-md ${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}>
      <h2 className="text-2xl font-bold mb-4">Usuários Cadastrados</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      {users.length === 0 ? (
        <Typography color="textSecondary">Nenhum usuário encontrado.</Typography>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((u, index) => (
            <div
              key={getId(u)} // chave única segura
              className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg shadow cursor-pointer ${
                darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => handleView(u)}
            >
              <div className="flex items-center gap-4">
                {/* Avatar ou inicial */}
                <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center text-xl font-bold">
                  {u.name[0]?.toUpperCase()}
                </div>

                {/* Info do usuário */}
                <div className="flex flex-col">
                  <p className="font-semibold">{index + 1}. {u.name}</p>
                  <p className="text-sm">{u.email}</p>
                  <p className="text-sm font-medium">{u.role}</p>
                  <p className="text-sm">{u.status}</p>
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => { e.stopPropagation(); handleView(u); }}
                >
                  Visualizar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={(e) => { e.stopPropagation(); handleDelete(getId(u)); }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de visualização */}
      {viewModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`bg-white p-6 rounded-lg w-96 ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
            <h3 className="text-xl font-bold mb-2">Detalhes do Usuário</h3>
            <p><strong>Nome:</strong> {selectedUser.name}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Status:</strong> {selectedUser.status}</p>
            <p><strong>Último login:</strong> {selectedUser.last_login_date ? new Date(selectedUser.last_login_date.$date).toLocaleString() : "Nunca"}</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button onClick={() => setViewModalOpen(false)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
