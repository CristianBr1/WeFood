import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import { useAuthContext } from "../hooks/useAuthContext";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Navbar from "../components/Navbar";
import { API_URL } from "../services/config";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const { darkMode } = useContext(ThemeContext);
  const { register, user, checkAuth } = useAuthContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redireciona se já estiver logado
  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setAuthChecked(true);
    };
    init();
  }, [checkAuth]);

  useEffect(() => {
    if (authChecked && user) {
      navigate("/", { replace: true });
    }
  }, [authChecked, user, navigate]);

  // Callback do Google OAuth
  useEffect(() => {
    if (searchParams.get("google") === "success") {
      checkAuth().then(() => navigate("/", { replace: true }));
    }
  }, [searchParams, checkAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Senha deve ter no mínimo 6 caracteres.");
      setLoading(false);
      return;
    }

    try {
      const success = await register(name, email, password);
      if (success) navigate("/", { replace: true });
      else setError("Erro ao registrar: e-mail já cadastrado ou inválido.");
    } catch {
      setError("Erro ao registrar. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // Guarda página atual para histórico
    sessionStorage.setItem("preOAuthPage", window.location.pathname);
    window.location.href = `${API_URL}/auth/google`;
  };

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
      className="min-h-screen flex items-center justify-center transition-colors"
      style={{ background: darkMode ? "#0f1724" : "#f3f4f6" }}
    >
      <Navbar />
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
          Criar Conta
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
            label="Nome"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            sx={outlinedSx}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            sx={outlinedSx}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Senha"
            type={isShowPassword ? "text" : "password"}
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

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              backgroundColor: "#16a34a",
              "&:hover": { backgroundColor: "#10b981" },
              py: 1.2,
              fontWeight: 600,
            }}
          >
            {loading ? "Registrando..." : "Registrar"}
          </Button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: 14,
            color: darkMode ? "#d1d5db" : "#374151",
          }}
        >
          Já tem uma conta?{" "}
          <Link to="/login" style={{ color: "#16a34a", fontWeight: 600 }}>
            Faça login
          </Link>
        </p>

        <div style={{ marginTop: 14 }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: 8,
              color: darkMode ? "#9ca3af" : "#6b7280",
            }}
          >
            OU
          </div>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<FcGoogle />}
            onClick={handleGoogleRegister}
            sx={{
              borderColor: "#e5e7eb",
              color: darkMode ? "#fff" : "#111827",
              backgroundColor: darkMode ? "#111827" : "#f8fafc",
              "&:hover": { backgroundColor: darkMode ? "#0b1220" : "#f1f5f9" },
              textTransform: "none",
            }}
          >
            Registrar com Google
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Register;
