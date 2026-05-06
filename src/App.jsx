import { useState } from "react";
import { logoutUsuario } from "./api/authApi";
import LoginPage     from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ClientesPage  from "./pages/ClientesPage";
import ProductosPage from "./pages/ProductosPage";
import InsumosPage from "./pages/InsumosPage";
import CategoriasPage from "./pages/CategoriasPage";
import ReportesPage from "./pages/ReportesPage";
import PuntoDeVentaPage from "./pages/PuntoDeVentaPage";
import VentasPage       from "./pages/VentasPage";
import EmpleadosPage from "./pages/EmpleadosPage";

export default function App() {
  const [loggedIn,    setLoggedIn]    = useState(false);
  const [currentPage, setCurrentPage] = useState("estadisticas");
  const [usuario,     setUsuario]     = useState(null); // ← nuevo

  const handleLogin = (userData) => {
    console.log("Usuario logueado:", userData);
    setUsuario(userData);   // { id, tipo, nombre }
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await logoutUsuario();
    setLoggedIn(false);
    setUsuario(null);
    setCurrentPage("estadisticas");
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;  // ← pasa handleLogin
  }

  const sharedProps = {
    currentPage,
    onNavigate: setCurrentPage,
    onLogout:   handleLogout,
    usuario,                  // ← pasa el usuario a todas las páginas
  };


  switch (currentPage) {
    case "estadisticas": return <DashboardPage {...sharedProps} />;
    case "clientes":     return <ClientesPage  {...sharedProps} />;
    case "productos": return <ProductosPage {...sharedProps} />;
    case "insumos": return <InsumosPage {...sharedProps} />;
    case "categorias": return <CategoriasPage {...sharedProps} />;
    case "reportes": return <ReportesPage {...sharedProps} />;
    case "punto-de-venta": return <PuntoDeVentaPage {...sharedProps} />;
    case "ventas":         return <VentasPage       {...sharedProps} />;
    case "empleados": return <EmpleadosPage {...sharedProps} />;

    default: return <DashboardPage {...sharedProps} />;
  }
}