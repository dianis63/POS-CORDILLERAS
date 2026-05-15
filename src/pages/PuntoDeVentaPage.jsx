import { useState, useEffect }  from "react";
import { CheckCircle }          from "lucide-react";
import { Sidebar }              from "../components/layout/Sidebar";
import { Topbar }               from "../components/layout/Topbar";
import { PDVCategorias }        from "../components/puntoDeVenta/PDVCategorias";
import { PDVProductos }         from "../components/puntoDeVenta/PDVProductos";
import { PDVTicket }            from "../components/puntoDeVenta/PDVTicket";
import { PDVNotaModal }         from "../components/puntoDeVenta/PDVNotaModal";
import { NotifPanel }           from "../components/dashboard/NotifPanel";
import { getCategorias }        from "../api/categoriaApi";
import { getProductos }         from "../api/productoApi";
import { crearVenta, completarPago, cancelarVenta, getVentaPorId, actualizarVenta } from "../api/ventaApi";
import { COLORS }               from "../constants/colors";

export default function PuntoDeVentaPage({ currentPage, onNavigate, onLogout, usuario, ventaEditar, onLimpiarVenta, notifs, refrescarNotifs }) {
  const [sidebarOpen,     setSidebarOpen]     = useState(true);
  const [notifOpen,       setNotifOpen]       = useState(false);
  const [categorias,      setCategorias]      = useState([]);
  const [productos,       setProductos]       = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(null);
  const [items,           setItems]           = useState([]);
  const [cliente,         setCliente]         = useState("");
  const [nota,            setNota]            = useState("");
  const [notaModalOpen,   setNotaModalOpen]   = useState(false);
  const [ventaActual,     setVentaActual]     = useState(null);
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(true);
  const [pagoModal,       setPagoModal]       = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (ventaEditar) {
      setCliente(ventaEditar.cliente || "");
      setNota(ventaEditar.nota || "");
      setVentaActual(ventaEditar.id);
      getVentaPorId(ventaEditar.id).then((data) => {
        if (data?.items) setItems(data.items);
      });
    }
  }, [ventaEditar]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategorias(), getProductos()]);

      const categoriasNorm = cats.map((c) => ({
        id:    c.idcategoria,
        key:   String(c.idcategoria),
        label: c.nombrecategoria,
      }));

      const productosNorm = prods
        .filter((p) => p.estadoproducto === "Activo")
        .map((p) => ({
          id:        p.idproducto,
          nombre:    p.nombreproducto,
          precio:    Number(p.preciounitario),
          talla:     p.tamanioproducto,
          categoria: String(p.idcategoria),
        }));

      setCategorias(categoriasNorm);
      setProductos(productosNorm);
      if (categoriasNorm.length > 0) setCategoriaActiva(categoriasNorm[0].key);
    } catch {
      setError("Error al cargar productos.");
    } finally {
      setLoading(false);
    }
  };

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

  const resetear = () => {
    setItems([]);
    setCliente("");
    setNota("");
    setVentaActual(null);
    setError("");
    onLimpiarVenta?.();
  };

  const handleCancelar = async () => {
    if (ventaActual) {
      try { await cancelarVenta(ventaActual); } catch { /* ya estaba sin guardar */ }
    }
    resetear();
  };

  const handleGuardar = async () => {
    if (items.length === 0) { setError("Agrega al menos un producto."); return; }
    setError("");
    try {
      if (ventaActual) {
        await actualizarVenta(ventaActual, {
          nombreCliente: cliente,
          nota,
          items: items.map((i) => ({ id: i.id, precio: i.precio, cantidad: i.cantidad })),
        });
      } else {
        const res = await crearVenta({
          nombreCliente: cliente,
          nota,
          items: items.map((i) => ({ id: i.id, precio: i.precio, cantidad: i.cantidad })),
        });
        setVentaActual(res.idVenta);
      }
      resetear();
      onNavigate("ventas");
    } catch {
      setError("Error al guardar la venta.");
    }
  };

  const handlePagar = async () => {
    if (items.length === 0) { setError("Agrega al menos un producto."); return; }
    setError("");
    try {
      let idVenta = ventaActual;
      if (!idVenta) {
        const res = await crearVenta({
          nombreCliente: cliente,
          nota,
          items: items.map((i) => ({ id: i.id, precio: i.precio, cantidad: i.cantidad })),
        });
        idVenta = res.idVenta;
      }
      await completarPago(idVenta);
      setPagoModal(true);
    } catch {
      setError("Error al procesar el pago.");
    }
  };

  const handleCerrarPagoModal = () => {
    setPagoModal(false);
    resetear();
    onNavigate("ventas");
  };

  const esPagada  = ventaEditar?.estado === "pagado";
  const esEdicion = ventaEditar !== null && !esPagada;

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.pageBg }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        usuario={usuario}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
       <Topbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            breadcrumb={["Venta", "Punto de venta"]}
            notifOpen={notifOpen}
            setNotifOpen={(val) => {
                if (val) refrescarNotifs();
                setNotifOpen(val);
            }}
            esAdmin={usuario?.tipo?.toLowerCase() === "admin"}
            notifs={notifs}
        />


        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>
            Punto de venta
          </h1>

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          {loading ? (
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>Cargando productos...</p>
          ) : (
            <div className="flex gap-5 items-start">
              <div className="flex-1 flex flex-col min-w-0">
                <PDVCategorias
                  categorias={categorias}
                  activa={categoriaActiva}
                  onSeleccionar={setCategoriaActiva}
                />
                <PDVProductos
                  productos={productos}
                  categoriaActiva={categoriaActiva}
                  onAgregar={handleAgregar}
                  esPagada={esPagada}
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
                  ventaGuardada={ventaActual !== null}
                  esEdicion={esEdicion}
                  esPagada={esPagada}
                  horaVenta={ventaEditar?.hora}
                  fechaVenta={ventaEditar?.fecha}
                />
              </div>
            </div>
          )}
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
          productosVencer={notifs.productosVencer}
          productosAgotar={notifs.productosAgotar}
          onClose={() => setNotifOpen(false)}
        />
      )}

      {/* Modal pago completado */}
      {pagoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-4 shadow-xl w-80"
            style={{ backgroundColor: COLORS.cardBg }}
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-green-100">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold mb-1" style={{ color: COLORS.textPrimary }}>
                Pago completado
              </p>
              <p className="text-sm" style={{ color: COLORS.textSecondary }}>
                    El pedido ha sido finalizado exitosamente.
              </p>
            </div>
            <button
              onClick={handleCerrarPagoModal}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: COLORS.accentBlue }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}