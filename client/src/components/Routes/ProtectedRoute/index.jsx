import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../../context/AuthProvider";

// Import component
import LoadingPage from "../../LoadingPage";

/**
 * Tato komponenta slouží k ochraně rout podle toho zda je uživatel přihlášen či nikoliv.
 * Pokud je uživatel přihlášený (proměnná `user` v `AuthContext` obsahuje token uživatele), umožní mu přístup k dané stránce
 * Například, pokud není uživatel přihlášen nemůže se dostat do /dashboard, tak v `AppRoutes` "obalíme" routu touto `ProtectedRoute` komponentou a ta ho podle toho zda je uživatel přihlášen přesměruje na `/dashboard`, nebo pokud není tak na `/signIn`.
 */
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if(isLoading) return <LoadingPage />;

  return user ? <Outlet /> : <Navigate to={"/signIn"} replace />; // replace - nahradí aktuální stránku v historii prohlížeče. To znamená, že uživatel se nemůže vrátit zpět tlačítkem zpět v prohlížeči.
}
