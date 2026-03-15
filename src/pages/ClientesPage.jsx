import { useState }           from "react";
import { Sidebar }            from "../components/layout/Sidebar";
import { Topbar }             from "../components/layout/Topbar";
import { ClientesToolbar }    from "../components/clientes/ClientesToolbar";
import { ClientesTable }      from "../components/clientes/ClientesTable";
import { ClientesPagination } from "../components/clientes/ClientesPagination";
import { ClienteForm }        from "../components/clientes/ClienteForm";
import { NotifPanel }         from "../components/dashboard/NotifPanel";
import { clientesIniciales, productosVencer, productosAgotar } from "../data/mockData";
import { COLORS }             from "../constants/colors";

const PER_PAGE = 10;

export default function ClientesPage({ currentPage, onNavigate, onLogout }) {
  const [clientes,    setClientes]    = useState(clientesIniciales);
  const [selected,    setSelected]    = useState([]);
  const [busqueda,    setBusqueda]    = useState("");
  const [pagina,      setPagina]      = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [vista,       setVista]       = useState(null);

  const filtrados    = clientes.filter(({ nombre, apellido, correo }) => {
    const q = busqueda.toLowerCase();
    return nombre.toLowerCase().includes(q)  ||
           apellido.toLowerCase().includes(q) ||
           correo.toLowerCase().includes(q);
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
      setClientes((p) => p.map((c) => c.id === vista.id ? { ...c, ...form } : c));
    } else {
      const id = Math.max(0, ...clientes.map((c) => c.id)) + 1;
      setClientes((p) => [...p, { id, ...form }]);
    }
    setVista(null);
  };

  const handleEliminar = () => {
    setClientes((p) => p.filter((c) => !selected.includes(c.id)));
    setSelected([]);
    setPagina(1);
  };

  const clienteEditando = vista && vista !== "nuevo" ? vista : null;

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
          breadcrumb={["Venta", "Clientes"]}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>
            Clientes
          </h1>

          {vista ? (
            <ClienteForm
              cliente={clienteEditando}
              onSave={handleGuardar}
              onCancel={() => setVista(null)}
            />
          ) : (
            <>
              <ClientesToolbar
                selected={selected}
                onAgregar={() => setVista("nuevo")}
                onEliminar={handleEliminar}
                busqueda={busqueda}
                onBusqueda={(val) => { setBusqueda(val); setPagina(1); }}
              />
              <ClientesTable
                visibles={visibles}
                selected={selected}
                allChecked={allChecked}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onEditar={(c) => setVista(c)}
              />
              <ClientesPagination
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