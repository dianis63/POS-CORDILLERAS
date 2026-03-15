import { useState }        from "react";
import { ShoppingBag, ShoppingCart, Package, Calendar } from "lucide-react";
import { Sidebar }         from "../components/layout/Sidebar";
import { Topbar }          from "../components/layout/Topbar";
import { VentaStatCard }   from "../components/ventas/VentaStatCard";
import { VentaCard }       from "../components/ventas/VentaCard";
import { NotifPanel }      from "../components/dashboard/NotifPanel";
import { ventasGuardadas, productosVencer, productosAgotar } from "../data/mockData";
import { COLORS }          from "../constants/colors";

const meses = {
  Enero: "01", Febrero: "02", Marzo: "03",    Abril: "04",
  Mayo:  "05", Junio:   "06", Julio:  "07",   Agosto: "08",
  Septiembre: "09", Octubre: "10", Noviembre: "11", Diciembre: "12",
};
function parsearFecha(fechaStr) {
  const [mes, diaRaw, anio] = fechaStr.replace(",", "").split(" ");
  return `${anio}-${meses[mes]}-${diaRaw.padStart(2, "0")}`;
}

export default function VentasPage({ currentPage, onNavigate, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [ventas,      setVentas]      = useState(ventasGuardadas);
  const [fecha,       setFecha]       = useState("2026-10-16");

  const ventasFecha = ventas.filter((v) => parsearFecha(v.fecha) === fecha);
  const sinPagar    = ventasFecha.filter((v) => v.estado === "sin-pagar").length;
  const productos   = ventasFecha.reduce((acc, v) => acc + v.productos, 0);

  const handleVer = () => onNavigate("punto-de-venta");

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.pageBg }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          breadcrumb={["Venta", "Ventas en curso"]}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>Ventas</h1>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}
            >
              <Calendar size={14} style={{ color: COLORS.textSecondary }} />
              <input
                type="date" value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="outline-none bg-transparent text-sm cursor-pointer"
                style={{ color: COLORS.textPrimary }}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <VentaStatCard label="Pedidos en curso"   value={sinPagar}           icon={ShoppingBag}  bg={COLORS.statVentaBg1} />
            <VentaStatCard label="Pedidos totales"    value={ventasFecha.length} icon={ShoppingCart} bg={COLORS.statVentaBg2} />
            <VentaStatCard label="Productos vendidos" value={productos}          icon={Package}      bg={COLORS.statVentaBg3} />
          </div>

          <div>
            <h2 className="text-base font-semibold mb-4" style={{ color: COLORS.textPrimary }}>
              Ventas en curso
            </h2>
            {ventasFecha.length === 0 ? (
              <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                No hay ventas registradas para esta fecha.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {ventasFecha.map((v) => (
                  <VentaCard key={v.id} venta={v} onVer={handleVer} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {notifOpen && (
        <NotifPanel
          productosVencer={productosVencer}
          productosAgotar={productosAgotar}
          onClose={() => setNotifOpen(false)}
        />
      )}
    </div>
  );
}