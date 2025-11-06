import { useState, useEffect, useCallback } from "react";
import { HomeService } from "../services/endpoints/home.Service";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async (options = {}) => {
    const { silent = false } = options;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await HomeService.getCategories();
      setCategories(data || []);
      return data || [];
    } catch (err) {
      setError(err);
      console.error("Erro ao buscar categorias:", err);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // initial load
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refresh: fetchCategories,
  };
};
