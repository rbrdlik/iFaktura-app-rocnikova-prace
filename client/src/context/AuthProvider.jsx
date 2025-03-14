import { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../models/user";

const AuthContext = createContext();

/**
 * Tento context umožnuje spravovat přihlášení a odhlášení uživatele, nebo získat to zda je přihlášen pomocí JWT tokenu.
 * @param {Object} props - Vstupní parametry komponenty
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      // Získáme token z `localStorage`, pokud token existuje, nastaví uživatele jako přihlášeného.
      const token = localStorage.getItem("token");
      if (token) {
        const userData = await getUser();
        setUser(userData);
      }
      setIsLoading(false);
    }

    fetchUser();
  }, []);

  /**
   * Funkce pro přihlášení uživatele.
   * Uloží token do `localStorage` a nastaví stav uživatele.
   *
   * @param {string} token - JWT token získaný po přihlášení.
   */
  const login = async (token) => {
    localStorage.setItem("token", token);
    const userData = await getUser();
    setUser(userData);
  };

  /**
   * Funkce pro odhlášení uživatele.
   * Odebere token z `localStorage` a vymaže stav uživatele.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Vlastní hook pro přístup ke kontextu
export const useAuth = () => useContext(AuthContext);
