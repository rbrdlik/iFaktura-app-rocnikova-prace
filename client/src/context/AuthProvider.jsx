import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/**
 * Tento context umožnuje spravovat přihlášení a odhlášení uživatele, nebo získat to zda je přihlášen pomocí JWT tokenu.
 * @param {Object} props - Vstupní parametry komponenty
 */
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Získáme token z `localStorage`, pokud token existuje, nastaví uživatele jako přihlášeného.
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
  }, []);

  /**
   * Funkce pro přihlášení uživatele.
   * Uloží token do `localStorage` a nastaví stav uživatele.
   *
   * @param {string} token - JWT token získaný po přihlášení.
   */
  const login = (token) => {
    localStorage.setItem("token", token);
    setUser({ token });
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
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Vlastní hook pro přístup ke kontextu
export const useAuth = () => useContext(AuthContext);
