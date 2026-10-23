import React, { createContext, useState, useContext } from 'react';
import { INITIAL_USER, ADMIN_USER } from '../data/productsData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Start with INITIAL_USER logged in for immediate demo experience,
  // or user can switch/logout anytime
  const [user, setUser] = useState(INITIAL_USER);

  // Authenticate user with role support
  const login = (email, password, selectedRole = 'customer') => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password' };
    }

    if (selectedRole === 'admin') {
      setUser({
        ...ADMIN_USER,
        email: email.toLowerCase().trim(),
        name: email.split('@')[0].toUpperCase() + ' (Admin)',
        role: 'admin',
      });
      return { success: true, message: 'Logged in successfully as Admin' };
    } else {
      setUser({
        ...INITIAL_USER,
        email: email.toLowerCase().trim(),
        name: email.split('@')[0],
        role: 'customer',
      });
      return { success: true, message: 'Logged in successfully as Customer' };
    }
  };

  // Quick switch for exam demonstration
  const quickSwitchRole = (targetRole) => {
    if (targetRole === 'admin') {
      setUser(ADMIN_USER);
    } else {
      setUser(INITIAL_USER);
    }
  };

  const signUp = ({ name, email, password, phone, address, role = 'customer' }) => {
    if (!name || !email || !password) {
      return { success: false, message: 'Please fill in all required fields' };
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '+91 98765 00000',
      address: address || '123 Green Street, Bangalore',
      role,
      avatar: role === 'admin' ? ADMIN_USER.avatar : INITIAL_USER.avatar,
      memberSince: 'October 2026',
    };

    setUser(newUser);
    return { success: true, message: `Account created successfully as ${role.toUpperCase()}!` };
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
    return { success: true, message: 'Profile updated successfully!' };
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        login,
        signUp,
        logout,
        updateProfile,
        quickSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
