import React, { createContext, useState, useContext } from 'react';
import { INITIAL_PRODUCTS, CATEGORIES } from '../data/productsData';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin capability: toggle in-stock status
  const toggleStockStatus = (productId) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, inStock: !item.inStock } : item
      )
    );
  };

  // Admin capability: add a new product
  const addNewProduct = (newProd) => {
    const item = {
      id: 'prod-' + (products.length + 1),
      ...newProd,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      stockCount: 20,
    };
    setProducts((prev) => [item, ...prev]);
    return { success: true, message: 'New product added to catalog!' };
  };

  // Filter products based on selected category & search query
  const getFilteredProducts = () => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.categoryId === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  const getProductById = (id) => {
    return products.find((item) => item.id === id);
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        categories: CATEGORIES,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        getFilteredProducts,
        getProductById,
        toggleStockStatus,
        addNewProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
