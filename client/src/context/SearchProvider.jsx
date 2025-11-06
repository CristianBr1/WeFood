import { createContext, useState, useMemo } from "react";

export const SearchContext = createContext();

const SearchProvider = ({ children }) => {
  const [searchItem, setSearchItem] = useState("");

  // Memoriza o valor pra evitar re-renderizações
  const value = useMemo(
    () => ({ searchItem, setSearchItem }),
    [searchItem]
  );

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
