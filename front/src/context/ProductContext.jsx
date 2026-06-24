import React, { createContext, useState, useCallback } from 'react';

export const ProductContext = createContext();

const initialFilters = {
  keyword: '',
  category: 'All',
  size: '',
  color: '',
  minPrice: '',
  maxPrice: '',
  sort: 'newest',
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const fetchProducts = useCallback(async (customFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string
      const params = new URLSearchParams();
      if (customFilters.keyword) params.append('keyword', customFilters.keyword);
      if (customFilters.category && customFilters.category !== 'All') {
        params.append('category', customFilters.category);
      }
      if (customFilters.size) params.append('size', customFilters.size);
      if (customFilters.color) params.append('color', customFilters.color);
      if (customFilters.minPrice) params.append('minPrice', customFilters.minPrice);
      if (customFilters.maxPrice) params.append('maxPrice', customFilters.maxPrice);
      if (customFilters.sort) params.append('sort', customFilters.sort);

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [filters]);

  const fetchProductById = async (id) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product');
      }
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const createProduct = async (productData, token) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create product');
      }
      fetchProducts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateProduct = async (id, productData, token) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update product');
      }
      fetchProducts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteProduct = async (id, token) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete product');
      }
      fetchProducts();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const submitReview = async (productId, rating, comment, token) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        filters,
        setFilter,
        resetFilters,
        fetchProducts,
        fetchProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        submitReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
