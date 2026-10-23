import React, { createContext, useState, useContext } from 'react';
import { INITIAL_USER, ADMIN_USER, SUPER_ADMIN_USER } from '../data/productsData';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Start with INITIAL_USER logged in for immediate demo experience,
  // or user can switch/logout anytime
  const [user, setUser] = useState(INITIAL_USER);

  // Authenticate user with role support (customer, admin, super_admin)
  const login = (email, password, selectedRole = 'customer') => {
    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password' };
    }

    const cleanEmail = email.toLowerCase().trim();

    if (selectedRole === 'super_admin' || cleanEmail.includes('superadmin')) {
      setUser({
        ...SUPER_ADMIN_USER,
        email: cleanEmail,
        role: 'super_admin',
      });
      return { success: true, message: 'Logged in successfully as Super Admin' };
    } else if (selectedRole === 'admin') {
      setUser({
        ...ADMIN_USER,
        email: cleanEmail,
        name: cleanEmail.split('@')[0].toUpperCase() + ' (Admin)',
        role: 'admin',
      });
      return { success: true, message: 'Logged in successfully as Admin' };
    } else {
      setUser({
        ...INITIAL_USER,
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        role: 'customer',
      });
      return { success: true, message: 'Logged in successfully as Customer' };
    }
  };

  // Quick switch for exam demonstration
  const quickSwitchRole = (targetRole) => {
    if (targetRole === 'super_admin') {
      setUser(SUPER_ADMIN_USER);
    } else if (targetRole === 'admin') {
      setUser(ADMIN_USER);
    } else {
      setUser(INITIAL_USER);
    }
  };

  const signUp = ({ name, email, password, phone, address, role = 'customer' }) => {
    if (!name || !email || !password) {
      return { success: false, message: 'Please fill in all required fields' };
    }

    const defaultAvatar =
      role === 'super_admin'
        ? SUPER_ADMIN_USER.avatar
        : role === 'admin'
        ? ADMIN_USER.avatar
        : INITIAL_USER.avatar;

    const newUser = {
      id: 'usr-' + Date.now(),
      name,
      username: email.split('@')[0],
      email: email.toLowerCase().trim(),
      phone: phone || '+91 98765 00000',
      address: address || '123 Green Street, Bangalore',
      role,
      status: role === 'super_admin' ? 'Active / Verified Super Admin' : 'Active',
      avatar: defaultAvatar,
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

  const changePassword = (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
      return { success: false, message: 'Both current and new passwords are required' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }
    return { success: true, message: 'Password updated successfully!' };
  };

  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin' || isSuperAdmin;
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isSuperAdmin,
        isAuthenticated,
        login,
        signUp,
        logout,
        updateProfile,
        changePassword,
        quickSwitchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
