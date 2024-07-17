import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface AuthContextType {
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
      const response = await axios.post("http://localhost:2000/auth/login", {
        email,
        password,
      });
      setAuth(response.data);
      localStorage.setItem("auth", JSON.stringify(response.data));
      console.log("the token is", localStorage.getItem("auth"));
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

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
