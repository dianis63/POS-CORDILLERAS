import { useState }               from "react";
import { Sidebar }                from "../components/layout/Sidebar";
import { Topbar }                 from "../components/layout/Topbar";
import { CategoriasToolbar }      from "../components/categorias/CategoriasToolbar";
import { CategoriasTable }        from "../components/categorias/CategoriasTable";
import { CategoriasPagination }   from "../components/categorias/CategoriasPagination";
import { CategoriaForm }          from "../components/categorias/CategoriaForm";
import { NotifPanel }             from "../components/dashboard/NotifPanel";
import { categoriasIniciales, productosVencer, productosAgotar } from "../data/mockData";
import { COLORS }                 from "../constants/colors";

const PER_PAGE = 10;

export default function CategoriasPage({ currentPage, onNavigate, onLogout }) {
  const [categorias,  setCategorias]  = useState(categoriasIniciales);
  const [selected,    setSelected]    = useState([]);
  const [busqueda,    setBusqueda]    = useState("");
  const [pagina,      setPagina]      = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [vista,       setVista]       = useState(null);

  const filtrados = categorias.filter(({ nombre, descripcion }) => {
    const q = busqueda.toLowerCase();
    return nombre.toLowerCase().includes(q) || descripcion.toLowerCase().includes(q);
  });
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles     = filtrados.slice((paginaActual - 1) * PER_PAGE, paginaActual * PER_PAGE);

  const ids        = visibles.map((c) => c.id);
  const allChecked = visibles.length > 0 && ids.every((id) => selected.includes(id));

  const toggleAll = () => {
    const all = ids.every((id) => selected.includes(id));
    setSelected(all
      ? selected.filter((id) => !ids.includes(id))
      : [...new Set([...selected, ...ids])]
    );
  };
  const toggleOne = (id) =>
    setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const handleGuardar = (form) => {
    if (vista && vista !== "nuevo") {
      setCategorias((p) => p.map((x) => x.id === vista.id ? { ...x, ...form } : x));
    } else {
      const id = Math.max(0, ...categorias.map((c) => c.id)) + 1;
      setCategorias((p) => [...p, { id, ...form }]);
    }
    setVista(null);
  };

  const handleEliminar = () => {
    setCategorias((p) => p.filter((x) => !selected.includes(x.id)));
    setSelected([]);
    setPagina(1);
  };

  const categoriaEditando = vista && vista !== "nuevo" ? vista : null;

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
          breadcrumb={["Inventario", "Categorías"]}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>
            Categorías
          </h1>

          {vista ? (
            <CategoriaForm
              categoria={categoriaEditando}
              onSave={handleGuardar}
              onCancel={() => setVista(null)}
            />
          ) : (
            <>
              <CategoriasToolbar
                selected={selected}
                onAgregar={() => setVista("nuevo")}
                onEliminar={handleEliminar}
                busqueda={busqueda}
                onBusqueda={(val) => { setBusqueda(val); setPagina(1); }}
              />
              <CategoriasTable
                visibles={visibles}
                selected={selected}
                allChecked={allChecked}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onEditar={(c) => setVista(c)}
              />
              <CategoriasPagination
                paginaActual={paginaActual}
                totalPaginas={totalPaginas}
                onCambiar={setPagina}
              />
            </>
          )}
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