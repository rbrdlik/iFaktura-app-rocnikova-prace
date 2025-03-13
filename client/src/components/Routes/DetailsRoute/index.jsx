import { Navigate, Outlet } from "react-router-dom";

/**
 * Tato komponenta slouží k tomu aby si uživatel po tom co se zaregistruje, musel nejprve nastavit své údaje.
 * Proto kontrolujeme zda má user `detailsName`, pokud ano, uživatele přesměrujeme na jakoukoliv stránku, pokud ne tak to vždy uživatele přesměruje na `/details` aby si nejprve nastavil své údaje.
 * @param {Object} user -- Získáváme data uživatele z `AppRoutes`.
 */
export default function DetailsRoute({user}){
    return !user?.payload?.detailsName ? <Navigate to={"/details"} /> : <Outlet />;
}