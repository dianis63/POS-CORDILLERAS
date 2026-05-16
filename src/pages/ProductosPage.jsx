import { useState, useEffect }     from "react";
import { Sidebar }                 from "../components/layout/Sidebar";
import { Topbar }                  from "../components/layout/Topbar";
import { ProductosToolbar }        from "../components/productos/ProductosToolbar";
import { ProductosTable }          from "../components/productos/ProductosTable";
import { ProductosPagination }     from "../components/productos/ProductosPagination";
import { ProductoForm }            from "../components/productos/ProductoForm";
import { NotifPanel }              from "../components/dashboard/NotifPanel";
import { getProductos, crearProducto, actualizarProducto, eliminarProducto } from "../api/productoApi";
import { COLORS }                  from "../constants/colors";

const PER_PAGE = 10;

export default function ProductosPage({ currentPage, onNavigate, onLogout, usuario, notifs, refrescarNotifs   }) {
  const [productos,   setProductos]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState([]);
  const [busqueda,    setBusqueda]    = useState("");
  const [pagina,      setPagina]      = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [vista,       setVista]       = useState(null);
  const [error,       setError]       = useState("");
  const [ordenCol,    setOrdenCol]    = useState("nombre");
  const [ordenDir,    setOrdenDir]    = useState("asc");

  useEffect(() => { cargarProductos(); }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const data = await getProductos();
      setProductos(data.map((p) => ({
        id:             p.idproducto,
        nombre:         p.nombreproducto,
        tamanio:        p.tamanioproducto,
        precioUnitario: Number(p.preciounitario),
        estado:         p.estadoproducto,
        idCategoria:    p.idcategoria,
        categoria:      p.nombrecategoria,
      })));
    } catch { setError("Error al cargar productos."); }
    finally  { setLoading(false); }
  };

  const filtrados = productos
    .filter(({ nombre, categoria, tamanio }) => {
      const q = busqueda.toLowerCase();
      return nombre.toLowerCase().includes(q)    ||
             categoria.toLowerCase().includes(q) ||
             tamanio.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const va = a[ordenCol] ?? "";
      const vb = b[ordenCol] ?? "";
      if (typeof va === "number") return ordenDir === "asc" ? va - vb : vb - va;
      return ordenDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles     = filtrados.slice((paginaActual - 1) * PER_PAGE, paginaActual * PER_PAGE);
  const ids          = visibles.map((p) => p.id);
  const allChecked   = visibles.length > 0 && ids.every((id) => selected.includes(id));

  const toggleAll = () => {
    const all = ids.every((id) => selected.includes(id));
    setSelected(all ? selected.filter((id) => !ids.includes(id)) : [...new Set([...selected, ...ids])]);
  };
  const toggleOne = (id) =>
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const toggleOrdenGlobal = () => setOrdenDir((d) => d === "asc" ? "desc" : "asc");
  const ordenarPorColumna = (col) => {
    if (ordenCol === col) setOrdenDir((d) => d === "asc" ? "desc" : "asc");
    else { setOrdenCol(col); setOrdenDir("asc"); }
  };

  const handleGuardar = async (form) => {
    setError("");
    try {
      if (vista && vista !== "nuevo") {
        await actualizarProducto(vista.id, {
          nombreProducto:  form.nombre,
          tamanioProducto: form.tamanio,
          precioUnitario:  form.precioUnitario,
          estadoProducto:  form.estado,
          idCategoria:     form.idCategoria,
        });
      } else {
        const res = await crearProducto({
          nombreProducto:  form.nombre,
          tamanioProducto: form.tamanio,
          precioUnitario:  form.precioUnitario,
          estadoProducto:  form.estado,
          idCategoria:     form.idCategoria,
        });
        if (res.message) { setError(res.message); return; }
      }
      await cargarProductos();
      setVista(null);
    } catch { setError("Error al guardar el producto."); }
  };

  const handleEliminar = async () => {
    setError("");
    try {
      await Promise.all(selected.map((id) => eliminarProducto(id)));
      await cargarProductos();
      setSelected([]);
      setPagina(1);
    } catch { setError("Error al eliminar productos."); }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.pageBg }}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} usuario={usuario} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            breadcrumb={["Inventario", "Productos"]}
            notifOpen={notifOpen}
            setNotifOpen={(val) => {
                if (val) refrescarNotifs();
                setNotifOpen(val);
            }}
            esAdmin={usuario?.tipo?.toLowerCase() === "admin"}
            notifs={notifs}
            usuario={usuario}
        />


        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>Productos</h1>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {loading ? (
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>Cargando productos...</p>
          ) : vista ? (
            <ProductoForm
              producto={vista !== "nuevo" ? vista : null}
              onSave={handleGuardar}
              onCancel={() => { setVista(null); setError(""); }}
            />
          ) : (
            <>
              <ProductosToolbar
                selected={selected}
                onAgregar={() => setVista("nuevo")}
                onEliminar={handleEliminar}
                busqueda={busqueda}
                onBusqueda={(val) => { setBusqueda(val); setPagina(1); }}
                onToggleOrden={toggleOrdenGlobal}
                onImprimir={() => window.print()}
              />
              <ProductosTable
                visibles={visibles} selected={selected} allChecked={allChecked}
                onToggleAll={toggleAll} onToggleOne={toggleOne} onEditar={(p) => setVista(p)}
                ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={ordenarPorColumna}
              />
              <ProductosPagination paginaActual={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
            </>
          )}
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