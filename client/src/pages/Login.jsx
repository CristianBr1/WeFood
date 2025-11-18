import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { ThemeContext } from "../context/ThemeProvider";
import Navbar from "../components/Navbar";
import { GoogleLogin } from "@react-oauth/google";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const { darkMode } = useContext(ThemeContext);
  const { user, login, checkAuth, loginWithGoogle } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // =============================
  // 1️⃣ Verifica login automático
  // =============================
  useEffect(() => {
    const init = async () => {
      await checkAuth();
      setAuthChecked(true);
    };
    init();
  }, []);

  // Se já estiver logado → redireciona
  useEffect(() => {
    if (authChecked && user) {
      navigate("/", { replace: true });
    }
  }, [authChecked, user, navigate]);

  // =============================
  // 2️⃣ Login normal
  // =============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("O e-mail é obrigatório.");
    if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      return setError("E-mail inválido.");
    if (!password.trim()) return setError("A senha é obrigatória.");
    if (password.trim().length < 6)
      return setError("A senha deve ter no mínimo 6 caracteres.");

    setFormLoading(true);
    try {
      const success = await login(email, password);
      if (success) navigate("/", { replace: true });
      else setError("E-mail ou senha inválidos!");
    } catch {
      setError("Erro ao tentar logar. Tente novamente.");
    } finally {
      setFormLoading(false);
    }
  };

  // =============================
  // Estilo dos inputs do MUI
  // =============================
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
    <>
      <Navbar />

      <section
        className="min-h-screen flex items-center justify-center transition-colors"
        style={{
          background: darkMode ? "#0f1724" : "#f3f4f6",
          paddingTop: "80px",
        }}
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
              style={{
                color: "#ef4444",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              {error}
            </p>
          )}

          {/* FORM */}
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
              disabled={formLoading}
              sx={{
                backgroundColor: "#16a34a",
                "&:hover": { backgroundColor: "#10b981" },
                py: 1.2,
                fontWeight: 600,
              }}
            >
              {formLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Separador */}
          <p
            style={{
              textAlign: "center",
              marginTop: 14,
              color: darkMode ? "#d1d5db" : "#374151",
            }}
          >
            Não tem uma conta?{" "}
            <Link to="/register" style={{ color: "#16a34a", fontWeight: 600 }}>
              Cadastre-se
            </Link>
          </p>

          {/* GOOGLE LOGIN */}
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <div
              style={{
                marginBottom: 8,
                color: darkMode ? "#9ca3af" : "#6b7280",
              }}
            >
              OU
            </div>

            <GoogleLogin
              style={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
              onSuccess={async (credentialResponse) => {
                try {
                  const credential = credentialResponse.credential;

                  const ok = await loginWithGoogle(credential);
                  if (ok) {
                    navigate("/", { replace: true });
                  } else {
                    setError("Falha ao fazer login com o Google.");
                  }
                } catch (error) {
                  console.error("Erro no login Google:", error);
                  setError("Erro ao tentar login com Google.");
                }
              }}
              onError={() => {
                setError("Erro ao tentar login com Google.");
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
