import { useState, useCallback } from "react";

export const useSearch = () => {
  const [searchItem, setSearchItem] = useState("");

  const clearSearch = useCallback(() => setSearchItem(""), []);

  return {
    searchItem,
    setSearchItem,
    clearSearch,
  };
};
