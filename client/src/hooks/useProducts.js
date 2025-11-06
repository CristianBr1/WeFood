import { useState, useCallback } from "react";
import { HomeService } from "../services/endpoints/home.Service";

// simple in-memory module-level cache for product details
const productCache = new Map();

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchByCategory = useCallback(async (categoryId, options = {}) => {
    if (!categoryId) {
      setProducts([]);
      return [];
    }
    const { silent = false } = options;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await HomeService.getProductsByCategory(categoryId);
      setProducts(data || []);
      // populate cache for product details
      (data || []).forEach((p) => {
        if (p && p._id) productCache.set(String(p._id), p);
      });
      return data || [];
    } catch (err) {
      setError(err);
      console.error("Erro ao buscar produtos por categoria:", err);
      setProducts([]);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const fetchAll = useCallback(async (params = {}, options = {}) => {
    const { silent = false } = options;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await HomeService.getAllProducts(params);
      setProducts(data || []);
      // populate cache
      (data || []).forEach((p) => {
        if (p && p._id) productCache.set(String(p._id), p);
      });
      return data || [];
    } catch (err) {
      setError(err);
      console.error("Erro ao buscar todos os produtos:", err);
      setProducts([]);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const getProductById = useCallback(async (id) => {
    if (!id) return null;
    const key = String(id);
    if (productCache.has(key)) {
      return productCache.get(key);
    }
    try {
      const data = await HomeService.getProductById(id);
      if (data && data._id) productCache.set(String(data._id), data);
      return data;
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      return null;
    }
  }, []);

  return {
    products,
    loading,
    error,
    fetchByCategory,
    fetchAll,
    getProductById,
  };
};
