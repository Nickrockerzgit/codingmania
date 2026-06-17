import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userEmail: string | null;
  token: string | null;
  login: (email: string, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    const savedToken = localStorage.getItem("authToken");
    if (savedEmail && savedToken) {
      setUserEmail(savedEmail);
      setToken(savedToken);
    }
  }, []);

  const login = (email: string, token: string) => {
    setUserEmail(email);
    setToken(token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("authToken", token);
  };

  const logout = () => {
    setUserEmail(null);
    setToken(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ userEmail, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};






