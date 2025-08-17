import React, { createContext, useState } from 'react';

export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('user');
      return null;
    }
  });

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
