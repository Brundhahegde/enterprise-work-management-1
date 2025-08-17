import React, { createContext, useState } from 'react';

// User roles constants
export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
};

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component to wrap your app and provide auth state & actions
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

  // Login function: sets role based on username/email and stores user in state and localStorage
  const login = (username, password) => {
    let role = ROLES.EMPLOYEE;

    if (
      username === 'admin' ||
      username === 'alice' ||
      username === 'alice@company.com'
    ) {
      role = ROLES.ADMIN;
    } else if (username === 'manager' || username === 'bob@company.com') {
      role = ROLES.MANAGER;
    }

    const loggedInUser = { username, role };
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    return loggedInUser;
  };

  // Logout function: clears user from state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Provide the user object and auth functions to children components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
