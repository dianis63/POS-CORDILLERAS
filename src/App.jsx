import { useState, useEffect } from "react";
import { logoutUsuario }  from "./api/authApi";
import { getNotifs }       from "./api/dashboardApi";
import LoginPage        from "./pages/LoginPage";
import DashboardPage    from "./pages/DashboardPage";
import ClientesPage     from "./pages/ClientesPage";
import ProductosPage    from "./pages/ProductosPage";
import InsumosPage      from "./pages/InsumosPage";
import CategoriasPage   from "./pages/CategoriasPage";
import ReportesPage     from "./pages/ReportesPage";
import PuntoDeVentaPage from "./pages/PuntoDeVentaPage";
import VentasPage       from "./pages/VentasPage";
import EmpleadosPage    from "./pages/EmpleadosPage";

export default function App() {
  const [loggedIn,    setLoggedIn]    = useState(false);
  const [currentPage, setCurrentPage] = useState("estadisticas");
  const [usuario,     setUsuario]     = useState(null);
  const [ventaEditar, setVentaEditar] = useState(null);
  const [notifs,      setNotifs]      = useState({ productosVencer: [], productosAgotar: [] });

  // Carga notificaciones globales cada vez que cambia de página
  useEffect(() => {
    if (!loggedIn) return;
    getNotifs()                                        // ← usa getNotifs
      .then((data) => setNotifs({
        productosVencer: data.productosVencer,
        productosAgotar: data.productosAgotar,
      }))
      .catch(() => {});
  }, [loggedIn, currentPage]);

  const handleLogin = (userData) => {
    setUsuario(userData);
    const paginaInicial = userData.tipo?.toLowerCase() === "admin" ? "estadisticas" : "punto-de-venta";
    setCurrentPage(paginaInicial);
    setLoggedIn(true);
  };

  const handleLogout = async () => {
    await logoutUsuario();
    setLoggedIn(false);
    setUsuario(null);
    setCurrentPage("estadisticas");
    setNotifs({ productosVencer: [], productosAgotar: [] });
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

    const esAdmin = usuario?.tipo?.toLowerCase() === "admin";


    const refrescarNotifs = () => {
    getNotifs()
        .then((data) => setNotifs({
            productosVencer: data.productosVencer,
            productosAgotar: data.productosAgotar,
        }))
        .catch(() => {});
};



  const sharedProps = {
    currentPage,
    onNavigate: (page) => {
      const soloAdmin = ["estadisticas", "reportes"];
      if (soloAdmin.includes(page) && !esAdmin) return;
      if (currentPage === "punto-de-venta" && page !== "punto-de-venta") {
        setVentaEditar(null);
      }
      setCurrentPage(page);
    },
    onLogout: handleLogout,
    usuario,
    // Solo admins ven notificaciones
    notifs: notifs,
    refrescarNotifs,
  };

  const handleVerVenta = (v) => {
    setVentaEditar(v);
    setCurrentPage("punto-de-venta");
  };

  switch (currentPage) {
    case "estadisticas":   return <DashboardPage    {...sharedProps} />;
    case "clientes":       return <ClientesPage     {...sharedProps} />;
    case "productos":      return <ProductosPage    {...sharedProps} />;
    case "insumos":        return <InsumosPage      {...sharedProps} />;
    case "categorias":     return <CategoriasPage   {...sharedProps} />;
    case "reportes":       return <ReportesPage     {...sharedProps} />;
    case "empleados":      return <EmpleadosPage    {...sharedProps} />;
    case "ventas":         return <VentasPage       {...sharedProps} onVerVenta={handleVerVenta} />;
    case "punto-de-venta": return <PuntoDeVentaPage {...sharedProps}
                                    ventaEditar={ventaEditar}
                                    onLimpiarVenta={() => setVentaEditar(null)} />;
    default:               return <DashboardPage    {...sharedProps} />;
  }
}