import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";

const SearchItem = () => {
  const { darkMode } = useContext(ThemeContext);
  const { searchItem, setSearchItem, cart = [], user } = useContext(AuthContext);

  return (
    <div className="flex flex-col w-full max-w-[600px] gap-2">
      {!user && (
        <div className="flex justify-center gap-2">
          <Link
            to="/login"
            className="text-sm md:text-base text-green-600 hover:underline transition"
          >
            Entrar
          </Link>
          <Link
            to="/register"
            className="text-sm md:text-base text-green-600 px-3 py-1"
          >
            / Cadastrar
          </Link>
        </div>
      )}

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
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
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
      </div>
    </div>
  );
};

export default SearchItem;
