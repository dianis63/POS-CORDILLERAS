import { useState }              from "react";
import { Sidebar }               from "../components/layout/Sidebar";
import { Topbar }                from "../components/layout/Topbar";
import { EmpleadosToolbar }      from "../components/empleados/EmpleadosToolbar";
import { EmpleadosTable }        from "../components/empleados/EmpleadosTable";
import { EmpleadosPagination }   from "../components/empleados/EmpleadosPagination";
import { EmpleadoForm }          from "../components/empleados/EmpleadoForm";
import { NotifPanel }            from "../components/dashboard/NotifPanel";
import { empleadosIniciales, productosVencer, productosAgotar } from "../data/mockData";
import { COLORS }                from "../constants/colors";

const PER_PAGE = 10;

export default function EmpleadosPage({ currentPage, onNavigate, onLogout }) {
  const [empleados,   setEmpleados]   = useState(empleadosIniciales);
  const [selected,    setSelected]    = useState([]);
  const [busqueda,    setBusqueda]    = useState("");
  const [pagina,      setPagina]      = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [vista,       setVista]       = useState(null);

  const filtrados = empleados.filter(({ nombre, apellido, cargo }) => {
    const q = busqueda.toLowerCase();
    return nombre.toLowerCase().includes(q)   ||
           apellido.toLowerCase().includes(q) ||
           cargo.toLowerCase().includes(q);
  });
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PER_PAGE));
  const paginaActual = Math.min(pagina, totalPaginas);
  const visibles     = filtrados.slice((paginaActual - 1) * PER_PAGE, paginaActual * PER_PAGE);

  const ids        = visibles.map((e) => e.id);
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
      setEmpleados((p) => p.map((x) => x.id === vista.id ? { ...x, ...form } : x));
    } else {
      const id = Math.max(0, ...empleados.map((e) => e.id)) + 1;
      setEmpleados((p) => [...p, { id, ...form }]);
    }
    setVista(null);
  };

  const handleEliminar = () => {
    setEmpleados((p) => p.filter((x) => !selected.includes(x.id)));
    setSelected([]);
    setPagina(1);
  };

  const empleadoEditando = vista && vista !== "nuevo" ? vista : null;

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
          breadcrumb={["Personal", "Empleados"]}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>
              Empleados
            </h1>

            {vista ? (
              <EmpleadoForm
                empleado={empleadoEditando}
                onSave={handleGuardar}
                onCancel={() => setVista(null)}
              />
            ) : (
              <>
                <EmpleadosToolbar
                  selected={selected}
                  onAgregar={() => setVista("nuevo")}
                  onEliminar={handleEliminar}
                  busqueda={busqueda}
                  onBusqueda={(val) => { setBusqueda(val); setPagina(1); }}
                />
                <EmpleadosTable
                  visibles={visibles}
                  selected={selected}
                  allChecked={allChecked}
                  onToggleAll={toggleAll}
                  onToggleOne={toggleOne}
                  onEditar={(e) => setVista(e)}
                />
                <EmpleadosPagination
                  paginaActual={paginaActual}
                  totalPaginas={totalPaginas}
                  onCambiar={setPagina}
                />
              </>
            )}
          </main>

          {notifOpen && (
            <NotifPanel
              productosVencer={productosVencer}
              productosAgotar={productosAgotar}
            />
          )}
        </div>
      </div>
    </div>
  );
}