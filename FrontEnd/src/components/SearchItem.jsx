import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";
import { ShoppingCart } from "lucide-react";

const SearchItem = () => {
  const { darkMode } = useContext(ThemeContext);
  const { searchItem, setSearchItem, cart = [] } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center gap-3 justify-between w-full max-w-[600px]"
      style={{ position: "relative" }}
    >
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Buscar no cardápio..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          style={{
            marginTop: "6px",
            width: "100%",
            padding: "0.6rem 2.2rem 0.6rem 1rem",
            borderRadius: "8px",
            background: darkMode ? "#222" : "#fff",
            color: darkMode ? "#fff" : "#222",
            border: darkMode ? "1px solid #444" : "none",
            boxShadow: darkMode ? "none" : "0 2px 8px rgba(0, 0, 0, 0.1)",
            fontSize: "1rem",
            fontFamily: "inherit",
            outline: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            right: "0.7rem",
            top: "50%",
            transform: "translateY(-50%)",
            color: darkMode ? "#fff" : "#888",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
            <line
              x1="16.5"
              y1="16.5"
              x2="21"
              y2="21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </div>

      <button
        onClick={() => navigate("/cart")}
        style={{
          position: "relative",
          background: darkMode ? "#333" : "#f5f5f5",
          color: darkMode ? "#fff" : "#333",
          border: darkMode ? "1px solid #444" : "1px solid #ddd",
          padding: "0.6rem",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.2s ease",
        }}
        className="hover:scale-105"
      >
        <ShoppingCart size={22} />
        {cart.length > 0 && (
          <span
            style={{
              position: "absolute",
              top: "0",
              right: "0",
              transform: "translate(35%, -35%)",
              background: "#ef4444",
              color: "#fff",
              borderRadius: "50%",
              fontSize: "0.7rem",
              padding: "0.2rem 0.45rem",
              fontWeight: "bold",
            }}
          >
            {cart.length}
          </span>
        )}
      </button>
    </div>
  );
};

export default SearchItem;
