import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import { AuthContext } from "../context/AuthProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const MyAccount = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user, setUser, logout } = useContext(AuthContext);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [message, setMessage] = useState("");

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // Simulação de atualização no backend
    if (newPassword && currentPassword !== "admin123") {
      setMessage("Senha atual incorreta!");
      return;
    }

    const updatedUser = {
      ...user,
      name,
      email,
      avatar,
      // Apenas atualiza senha se foi fornecida
      password: newPassword ? newPassword : user.password,
    };

    setUser(updatedUser); // Atualiza no contexto
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Salva no localStorage
    setMessage("Perfil atualizado com sucesso!");
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <section
      className={`min-h-screen p-6 transition-colors`}
      style={{ background: darkMode ? "#0f1724" : "#f3f4f6" }}
    >
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          padding: 24,
          borderRadius: 12,
          background: darkMode ? "#111827" : "#ffffff",
          color: darkMode ? "#fff" : "#111827",
          boxShadow: darkMode
            ? "0 6px 20px rgba(0,0,0,0.6)"
            : "0 8px 24px rgba(15,23,42,0.06)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Minha Conta</h2>

        {message && (
          <p style={{ color: "#4ade80", textAlign: "center" }}>{message}</p>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <img
              src={
                avatar ||
                "https://marketplace.canva.com/gJly0/MAGDkMgJly0/1/tl/canva-user-profile-icon-vector.png"
              }
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover"
            />
            <input type="file" onChange={handleAvatarChange} />
          </div>

          <TextField
            label="Nome"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="Senha atual"
            variant="outlined"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
          />

          <TextField
            label="Nova senha"
            variant="outlined"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
          />

          <Button variant="contained" color="success" onClick={handleSave}>
            Salvar alterações
          </Button>

          <Button variant="outlined" color="error" onClick={logout}>
            Sair
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
