import { useState }         from "react";
import { Sidebar }          from "../components/layout/Sidebar";
import { Topbar }           from "../components/layout/Topbar";
import { PDVCategorias }    from "../components/puntoDeVenta/PDVCategorias";
import { PDVProductos }     from "../components/puntoDeVenta/PDVProductos";
import { PDVTicket }        from "../components/puntoDeVenta/PDVTicket";
import { PDVNotaModal }     from "../components/puntoDeVenta/PDVNotaModal";
import { NotifPanel }       from "../components/dashboard/NotifPanel";
import { categoriasPDV, productosPDV, productosVencer, productosAgotar } from "../data/mockData";
import { COLORS }           from "../constants/colors";

export default function PuntoDeVentaPage({ currentPage, onNavigate, onLogout }) {
  const [sidebarOpen,     setSidebarOpen]     = useState(true);
  const [notifOpen,       setNotifOpen]       = useState(false);
  const [categoriaActiva, setCategoriaActiva] = useState(categoriasPDV[0].key);
  const [items,           setItems]           = useState([]);
  const [cliente,         setCliente]         = useState("");
  const [nota,            setNota]            = useState("");
  const [notaModalOpen,   setNotaModalOpen]   = useState(false);

  const handleAgregar = (producto) => {
    setItems((prev) => {
      const existe = prev.find((i) => i.id === producto.id);
      if (existe) return prev.map((i) => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const handleCantidad = (id, delta) => {
    setItems((prev) =>
      prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
          .filter((i) => i.cantidad > 0)
    );
  };

  const handleEliminar = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const handleCancelar = ()   => { setItems([]); setCliente(""); setNota(""); };
  const handleGuardar  = ()   => alert("Venta guardada.");
  const handlePagar    = ()   => { alert("Pago completado."); handleCancelar(); };

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
          breadcrumb={["Venta", "Punto de venta"]}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>
            Punto de venta
          </h1>

          <div className="flex gap-5 items-start">
            <div className="flex-1 flex flex-col min-w-0">
              <PDVCategorias
                categorias={categoriasPDV}
                activa={categoriaActiva}
                onSeleccionar={setCategoriaActiva}
              />
              <PDVProductos
                productos={productosPDV}
                categoriaActiva={categoriaActiva}
                onAgregar={handleAgregar}
              />
            </div>

            <div className="w-[26rem] flex-shrink-0">
              <PDVTicket
                items={items}
                cliente={cliente}
                nota={nota}
                onClienteChange={setCliente}
                onCambiarCantidad={handleCantidad}
                onEliminar={handleEliminar}
                onCancelar={handleCancelar}
                onGuardar={handleGuardar}
                onPagar={handlePagar}
                onNota={() => setNotaModalOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>

      <PDVNotaModal
        open={notaModalOpen}
        nota={nota}
        onClose={() => setNotaModalOpen(false)}
        onGuardar={(val) => { setNota(val); setNotaModalOpen(false); }}
      />

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