import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import { AuthContext } from "../context/AuthProvider";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

const Login = () => {
  const { darkMode } = useContext(ThemeContext);
  const { login, user, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redireciona se já estiver logado e for admin
  useEffect(() => {
    if (!loading && user && user.role === "ADMIN") {
      navigate("/", { replace: true });
    }
  }, [user, loading, navigate]);

  // apenas ajuste no handleSubmit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const loggedUser = await login(email, password);
      if (!loggedUser) {
        setError("E-mail ou senha inválidos!");
        return;
      }

      if (loggedUser.role !== "ADMIN") {
        setError(
          "Você não tem permissão para acessar o painel de administração!"
        );
        return;
      }

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao logar");
    }
  };

  if (loading) return <div>Carregando...</div>;

  const outlinedSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: darkMode ? "#374151" : "#ffffff",
      color: darkMode ? "#fff" : "#000",
      borderRadius: 1,
      "& fieldset": { borderColor: darkMode ? "#555" : "#d1d5db" },
      "&:hover fieldset": { borderColor: darkMode ? "#9ca3af" : "#86efac" },
      "&.Mui-focused fieldset": {
        borderColor: darkMode ? "#4ade80" : "#16a34a",
        boxShadow: darkMode
          ? "0 0 0 3px rgba(74,222,128,0.08)"
          : "0 0 0 3px rgba(34,197,94,0.08)",
      },
    },
    "& .MuiInputLabel-root": { color: darkMode ? "#fff" : "#000" },
  };

  return (
    <section
      className={`min-h-screen flex items-center justify-center transition-colors`}
      style={{ background: darkMode ? "#0f1724" : "#f3f4f6" }}
    >
      <div
        style={{
          width: 500,
          padding: 24,
          borderRadius: 12,
          boxShadow: darkMode
            ? "0 6px 20px rgba(0,0,0,0.6)"
            : "0 8px 24px rgba(15,23,42,0.06)",
          background: darkMode ? "#111827" : "#ffffff",
          color: darkMode ? "#fff" : "#111827",
        }}
      >
        <h3
          style={{
            textAlign: "center",
            marginBottom: 12,
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          Login
        </h3>

        {error && (
          <p
            style={{ color: "#ef4444", textAlign: "center", marginBottom: 12 }}
          >
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <TextField
            id="email"
            type="email"
            label="E-mail"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={outlinedSx}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            id="password"
            type={isShowPassword ? "text" : "password"}
            label="Senha"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            sx={outlinedSx}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      isShowPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    onClick={() => setIsShowPassword((s) => !s)}
                    edge="end"
                    size="large"
                    sx={{ color: darkMode ? "#d1d5db" : "#374151" }}
                    type="button"
                  >
                    {isShowPassword ? <IoMdEye /> : <IoMdEyeOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 14,
            }}
          >
            <Link
              to="/forgot-password"
              style={{
                color: "#16a34a",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            variant="contained"
            type="submit"
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#10b981" },
              py: 1.2,
              fontWeight: 600,
            }}
          >
            Entrar
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Login;
