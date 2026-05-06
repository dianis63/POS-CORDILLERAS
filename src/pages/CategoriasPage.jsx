import { useState, useEffect }     from "react";
import { Sidebar }                 from "../components/layout/Sidebar";
import { Topbar }                  from "../components/layout/Topbar";
import { CategoriasToolbar }       from "../components/categorias/CategoriasToolbar";
import { CategoriasTable }         from "../components/categorias/CategoriasTable";
import { CategoriasPagination }    from "../components/categorias/CategoriasPagination";
import { CategoriaForm }           from "../components/categorias/CategoriaForm";
import { NotifPanel }              from "../components/dashboard/NotifPanel";
import { getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from "../api/categoriaApi";
import { productosVencer, productosAgotar } from "../data/mockData";
import { COLORS }                  from "../constants/colors";

const PER_PAGE = 10;

export default function CategoriasPage({ currentPage, onNavigate, onLogout, usuario }) {
  const [categorias,  setCategorias]  = useState([]);
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

  useEffect(() => { cargarCategorias(); }, []);

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const data = await getCategorias();
      setCategorias(data.map((c) => ({
        id:          c.idcategoria,
        nombre:      c.nombrecategoria,
        descripcion: c.descripcioncategoria,
      })));
    } catch { setError("Error al cargar categorías."); }
    finally  { setLoading(false); }
  };

  const filtrados = categorias
    .filter(({ nombre, descripcion }) => {
      const q = busqueda.toLowerCase();
      return nombre.toLowerCase().includes(q) || descripcion.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      const va = a[ordenCol] ?? "";
      const vb = b[ordenCol] ?? "";
      return ordenDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles     = filtrados.slice((paginaActual - 1) * PER_PAGE, paginaActual * PER_PAGE);
  const ids          = visibles.map((c) => c.id);
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
        await actualizarCategoria(vista.id, {
          nombreCategoria:      form.nombre,
          descripcionCategoria: form.descripcion,
        });
      } else {
        const res = await crearCategoria({
          nombreCategoria:      form.nombre,
          descripcionCategoria: form.descripcion,
        });
        if (res.message) { setError(res.message); return; }
      }
      await cargarCategorias();
      setVista(null);
    } catch { setError("Error al guardar la categoría."); }
  };

  const handleEliminar = async () => {
    setError("");
    try {
      await Promise.all(selected.map((id) => eliminarCategoria(id)));
      await cargarCategorias();
      setSelected([]);
      setPagina(1);
    } catch { setError("Error al eliminar categorías."); }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.pageBg }}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} usuario={usuario} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          breadcrumb={["Inventario", "Categorías"]} notifOpen={notifOpen} setNotifOpen={setNotifOpen} />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>Categorías</h1>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {loading ? (
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>Cargando categorías...</p>
          ) : vista ? (
            <CategoriaForm
              categoria={vista !== "nuevo" ? vista : null}
              onSave={handleGuardar}
              onCancel={() => { setVista(null); setError(""); }}
            />
          ) : (
            <>
              <CategoriasToolbar
                selected={selected}
                onAgregar={() => setVista("nuevo")}
                onEliminar={handleEliminar}
                busqueda={busqueda}
                onBusqueda={(val) => { setBusqueda(val); setPagina(1); }}
                onToggleOrden={toggleOrdenGlobal}
                onImprimir={() => window.print()}
              />
              <CategoriasTable
                visibles={visibles} selected={selected} allChecked={allChecked}
                onToggleAll={toggleAll} onToggleOne={toggleOne} onEditar={(c) => setVista(c)}
                ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={ordenarPorColumna}
              />
              <CategoriasPagination paginaActual={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
            </>
          )}
        </main>
      </div>

      {notifOpen && <NotifPanel productosVencer={productosVencer} productosAgotar={productosAgotar} onClose={() => setNotifOpen(false)} />}
    </div>
  );
}