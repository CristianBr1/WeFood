import { useContext, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";
import { SearchContext } from "../context/SearchProvider";
import { useAuthContext } from "../hooks/useAuthContext";

const SearchItem = () => {
  const { darkMode } = useContext(ThemeContext);
  const { searchItem, setSearchItem } = useContext(SearchContext);
  const { user } = useAuthContext();
  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState(searchItem || "");

  // Keep local input in sync when external searchItem is cleared/changed
  useEffect(() => {
    setInputValue(searchItem || "");
  }, [searchItem]);

  const handleSearch = () => {
    // commit local input to shared search context (trim whitespace)
    setSearchItem((inputValue || "").trim());

    // blur input to close virtual keyboards on mobile
    if (inputRef.current) inputRef.current.blur();

    // scroll products into view if present
    const productsEl = document.getElementById("product-list");
    if (productsEl) productsEl.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
            ref={inputRef}
            type="text"
            placeholder="Buscar no cardápio..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch(e);
              }
            }}
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
          <button
            aria-label="buscar"
            onClick={handleSearch}
            type="button"
            style={{
              position: "absolute",
              right: "0.7rem",
              top: "50%",
              transform: "translateY(-50%)",
              color: darkMode ? "#fff" : "#888",
              display: "flex",
              alignItems: "center",
              background: "transparent",
              border: "none",
              padding: 0,
              margin: 0,
              cursor: "pointer",
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
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchItem;
