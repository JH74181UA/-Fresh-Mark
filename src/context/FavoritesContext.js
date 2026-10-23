import React, { createContext, useState, useContext } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  // Prepopulate with a couple of favorites for nice initial display
  const [favorites, setFavorites] = useState([
    {
      id: 'prod-1',
      name: 'Fresh Red Apples',
      category: 'Fruits & Veggies',
      categoryId: 'fruits_veg',
      price: 4.99,
      originalPrice: 6.49,
      unit: '1 kg (approx. 5-6 pcs)',
      rating: 4.9,
      reviewsCount: 245,
      inStock: true,
      description: 'Crisp, sweet, and juicy handpicked red apples grown in organic orchards. Rich in dietary fiber, vitamin C, and antioxidants.',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
      badge: '15% OFF'
    },
    {
      id: 'prod-3',
      name: 'Farm Fresh Brown Eggs',
      category: 'Dairy & Eggs',
      categoryId: 'dairy_eggs',
      price: 3.89,
      originalPrice: 4.50,
      unit: '12 Pack (Grade A)',
      rating: 4.9,
      reviewsCount: 312,
      inStock: true,
      description: 'Organic free-range brown eggs delivered straight from local cruelty-free farms. Packed with high-quality protein.',
      image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
      badge: 'Best Value'
    }
  ]);

  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  const toggleFavorite = (product) => {
    if (isFavorite(product.id)) {
      setFavorites((prev) => prev.filter((item) => item.id !== product.id));
      return false; // Removed
    } else {
      setFavorites((prev) => [product, ...prev]);
      return true; // Added
    }
  };

  const removeFromFavorites = (productId) => {
    setFavorites((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite,
        removeFromFavorites,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
