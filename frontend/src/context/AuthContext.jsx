
import React, { createContext, useState, useEffect, useContext } from 'react';

// Cria o contexto de autenticação
const AuthContext = createContext();

/**
 * AuthProvider: gerencia token globalmente e expõe login/logout
 */
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('token');
    if (saved) {
      setToken(saved);
    }
  }, []);

  // Armazena token em localStorage e no estado
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // Remove token de localStorage e do estado
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook para consumir AuthContext
 */
export function useAuth() {
  return useContext(AuthContext);
}

