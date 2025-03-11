import AppRoutes from "./pages/AppRoutes"
import AuthProvider from "./context/AuthProvider";

export default function App(){
  return(
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}