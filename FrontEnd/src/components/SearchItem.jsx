import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";
import AuthContext from "../context/AuthContext";

const SearchItem = () => {
  const { darkMode } = useContext(ThemeContext);

 const { searchItem, setSearchItem } = useContext(AuthContext);

  return (
    <div className="searchBox w-[100%] h-12 border-solid rounded-[4px]  relative p-2">
      <input
        type="text"
        placeholder="Buscar no cardápio..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={{
          marginTop: "6px",
          width: "100%",
          padding: "0.4rem 2.2rem 0.4rem 1rem",
          borderRadius: "5px",
          background: darkMode ? "#222" : "#f2f2f2",
          color: darkMode ? "#fff" : "#222",
          fontSize: "1rem",
          fontFamily: "inherit",
          outline: "none",
        }}
      />
      <span
        style={{
          position: "absolute",
          right: 0,
          top: "40%",
          transform: "translateY(-50%)",
          color: darkMode ? "#fff" : "#888",
          display: "flex",
          alignItems: "center",
          pointerEvents: "none",
          zIndex: 2,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block", marginRight: "0.7rem" }}
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
  );
};

export default SearchItem;
