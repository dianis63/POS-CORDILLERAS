import { useState, useEffect }   from "react";
import { ShoppingBag, ShoppingCart, Package, Calendar } from "lucide-react";
import { Sidebar }               from "../components/layout/Sidebar";
import { Topbar }                from "../components/layout/Topbar";
import { VentaStatCard }         from "../components/ventas/VentaStatCard";
import { VentaCard }             from "../components/ventas/VentaCard";
import { NotifPanel }            from "../components/dashboard/NotifPanel";
import { getVentas }             from "../api/ventaApi";
import { COLORS }                from "../constants/colors";

export default function VentasPage({ currentPage, onNavigate, onLogout, usuario, onVerVenta, notifs, refrescarNotifs  }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [ventas,      setVentas]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [fecha,       setFecha]       = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'America/El_Salvador' })
  );

  useEffect(() => { cargarVentas(); }, []);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      const data = await getVentas();
      setVentas(data.map((v) => ({
        id:        v.idventa,
        idOrden:   v.idorden,
        estado:    v.estadoventa,
        fecha:     new Date(v.fechaventa).toLocaleDateString('es-SV', {
                     month: 'long', day: 'numeric', year: 'numeric',
                     timeZone: 'America/El_Salvador'
                   }),
        fechaISO:  v.fechaventa,
        hora: (() => {
            const h = v.horaorden?.slice(0, 5);
            if (!h) return "";
            const [hh, mm] = h.split(":");
            const hora = parseInt(hh);
            const ampm = hora >= 12 ? "PM" : "AM";
            const hora12 = hora % 12 || 12;
            return `${String(hora12).padStart(2, "0")}:${mm} ${ampm}`;
          })(),
        cliente:   v.nombrecliente,
        total:     Number(v.total),
        productos: v.cantidadproducto,
        nota:      v.notaorden,
      })));
    } catch { setError("Error al cargar ventas."); }
    finally  { setLoading(false); }
  };

  const ventasFecha = fecha
  ? ventas.filter((v) => v.fechaISO?.slice(0, 10) === fecha)
  : ventas;

  const sinPagar  = ventasFecha.filter((v) => v.estado === "sin-pagar").length;
  const productos = ventasFecha
    .filter((v) => v.estado === "pagado")  
    .reduce((acc, v) => acc + v.productos, 0);

  const handleVer = (venta) => {
    onVerVenta(venta); // pasa la venta seleccionada al App
    onNavigate("punto-de-venta");
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.pageBg }}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} usuario={usuario} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            breadcrumb={["Venta", "Ventas"]}
            notifOpen={notifOpen}
            setNotifOpen={(val) => {
                if (val) refrescarNotifs();
                setNotifOpen(val);
            }}
            esAdmin={usuario?.tipo?.toLowerCase() === "admin"}
            notifs={notifs}
            usuario={usuario}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>Ventas</h1>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm"
              style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}>
              <Calendar size={14} style={{ color: COLORS.textSecondary }} />
              <input type="date" value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="outline-none bg-transparent text-sm cursor-pointer"
                style={{ color: COLORS.textPrimary }} />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4">
            <VentaStatCard label="Pedidos en curso"   value={sinPagar}           icon={ShoppingBag}  bg={COLORS.statVentaBg1} />
            <VentaStatCard label="Pedidos totales"    value={ventasFecha.length} icon={ShoppingCart} bg={COLORS.statVentaBg2} />
            <VentaStatCard label="Productos vendidos" value={productos}          icon={Package}      bg={COLORS.statVentaBg3} />
          </div>

          <div>
            <h2 className="text-base font-semibold mb-4" style={{ color: COLORS.textPrimary }}>
              Ventas en curso
            </h2>
            {loading ? (
              <p className="text-sm" style={{ color: COLORS.textSecondary }}>Cargando ventas...</p>
            ) : ventasFecha.length === 0 ? (
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
            productosVencer={notifs.productosVencer}
            productosAgotar={notifs.productosAgotar}
            onClose={() => setNotifOpen(false)}
          />
        )}
    </div>
  );
}