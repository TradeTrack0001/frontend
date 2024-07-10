import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthContextType {
  auth: AuthData | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthData {
  token: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [auth, setAuth] = useState<AuthData | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("api/auth/login", {
        email,
        password,
      });
      setAuth(response.data);
      localStorage.setItem("auth", JSON.stringify(response.data));
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      await axios.post("http://localhost:2000/auth/register", {
        email,
        password,
      });
    } catch (error) {
      console.error("Registration error", error);
      throw error;
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
