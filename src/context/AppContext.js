// src/context/AppContext.js
import React, { createContext, useContext, useState, useCallback } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Auth state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Registered users (local)
  const [registeredUsers, setRegisteredUsers] = useState([
    {
      id: 'admin001',
      name: 'Admin User',
      email: 'admin@grocery.com',
      password: 'Admin@123',
      phone: '9876543210',
      address: '123 Admin Street, Mumbai',
      role: 'admin',
    },
    {
      id: 'cust001',
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'John@123',
      phone: '9123456789',
      address: '456 Customer Lane, Delhi',
      role: 'customer',
    },
  ]);

  // Cart state
  const [cartItems, setCartItems] = useState([]);

  // Favorites state
  const [favorites, setFavorites] = useState([]);

  // ---- Auth Actions ----
  const signIn = useCallback(
    (email, password, role) => {
      const found = registeredUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password &&
          u.role === role
      );
      if (found) {
        setUser(found);
        setIsAuthenticated(true);
        return { success: true, user: found };
      }
      return { success: false, message: 'Invalid email, password, or role.' };
    },
    [registeredUsers]
  );

  const signUp = useCallback(
    (userData) => {
      const exists = registeredUsers.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );
      if (exists) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const newUser = {
        ...userData,
        id: `user_${Date.now()}`,
      };
      setRegisteredUsers((prev) => [...prev, newUser]);
      return { success: true, message: 'Account created successfully! Please sign in.' };
    },
    [registeredUsers]
  );

  const signOut = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setCartItems([]);
    setFavorites([]);
  }, []);

  const updateProfile = useCallback(
    (updatedData) => {
      setUser((prev) => ({ ...prev, ...updatedData }));
      setRegisteredUsers((prev) =>
        prev.map((u) => (u.id === user?.id ? { ...u, ...updatedData } : u))
      );
    },
    [user]
  );

  // ---- Cart Actions ----
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId, delta) => {
    setCartItems((prev) => {
      return prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  );

  // ---- Favorites Actions ----
  const addToFavorites = useCallback((product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromFavorites = useCallback((productId) => {
    setFavorites((prev) => prev.filter((p) => p.id !== productId));
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        return prev.filter((p) => p.id !== product.id);
      }
      return [...prev, product];
    });
  }, []);

  const isFavorite = useCallback(
    (productId) => favorites.some((p) => p.id === productId),
    [favorites]
  );

  return (
    <AppContext.Provider
      value={{
        // Auth
        user,
        isAuthenticated,
        signIn,
        signUp,
        signOut,
        updateProfile,
        // Cart
        cartItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
        // Favorites
        favorites,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
