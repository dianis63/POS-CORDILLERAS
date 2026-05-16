import { useState, useEffect }       from "react";
import { Sidebar }                   from "../components/layout/Sidebar";
import { Topbar }                    from "../components/layout/Topbar";
import { EmpleadosToolbar }          from "../components/empleados/EmpleadosToolbar";
import { EmpleadosTable }            from "../components/empleados/EmpleadosTable";
import { EmpleadosPagination }       from "../components/empleados/EmpleadosPagination";
import { EmpleadoForm }              from "../components/empleados/EmpleadoForm";
import { NotifPanel }                from "../components/dashboard/NotifPanel";
import { getEmpleados, crearEmpleado, actualizarEmpleado, eliminarEmpleado } from "../api/empleadoApi";
import { COLORS }                    from "../constants/colors";

const PER_PAGE = 10;

export default function EmpleadosPage({ currentPage, onNavigate, onLogout,usuario, notifs, refrescarNotifs   }) {
  const [empleados,   setEmpleados]   = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [selected,    setSelected]    = useState([]);
  const [busqueda,    setBusqueda]    = useState("");
  const [pagina,      setPagina]      = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [vista,       setVista]       = useState(null);
  const [error,       setError]       = useState("");

  // Cargar empleados al montar
  useEffect(() => {
    cargarEmpleados();
  }, []);
const [ordenCol,  setOrdenCol]  = useState("nombre");
const [ordenDir,  setOrdenDir]  = useState("asc");
  const cargarEmpleados = async () => {
    setLoading(true);
    try {
      const data = await getEmpleados();
      // Normalizar campos para que coincidan con la tabla
      setEmpleados(data.map((e) => ({
        id:       e.idempleado,
        nombre:   e.nombreempleado,
        apellido: e.apellidoempleado,
        telefono: e.telefonoempleado,
        cargo:    e.cargoempleado,
        salario:  Number(e.salarioempleado),
        usuario:  e.usuario,
        tipoUsuario: e.tipousuario,
      })));
    } catch {
      setError("Error al cargar empleados.");
    } finally {
      setLoading(false);
    }
  };

 // Reemplaza la línea de filtrados con esto:
const filtrados = empleados
  .filter(({ nombre, apellido, cargo }) => {
    const q = busqueda.toLowerCase();
    return nombre.toLowerCase().includes(q)   ||
           apellido.toLowerCase().includes(q) ||
           cargo.toLowerCase().includes(q);
  })
  .sort((a, b) => {
    const va = a[ordenCol] ?? "";
    const vb = b[ordenCol] ?? "";
    if (typeof va === "number") {
      return ordenDir === "asc" ? va - vb : vb - va;
    }
    return ordenDir === "asc"
      ? String(va).localeCompare(String(vb))
      : String(vb).localeCompare(String(va));
  });

// Función para flechas globales (alterna asc/desc en columna actual)
const toggleOrdenGlobal = () =>
  setOrdenDir((d) => (d === "asc" ? "desc" : "asc"));

// Función para clic en columna
const ordenarPorColumna = (col) => {
  if (ordenCol === col) {
    setOrdenDir((d) => (d === "asc" ? "desc" : "asc"));
  } else {
    setOrdenCol(col);
    setOrdenDir("asc");
  }
};

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

  const handleGuardar = async (form) => {
    setError("");
    try {
      if (vista && vista !== "nuevo") {
        // Editar
        await actualizarEmpleado(vista.id, {
          nombreEmpleado:   form.nombre,
          apellidoEmpleado: form.apellido,
          telefonoEmpleado: form.telefono,
          cargoEmpleado:    form.cargo,
          salarioEmpleado:  form.salario,
          // Contraseña solo si la escribió
          ...(form.contrasena ? { contrasena: form.contrasena } : {}),
        });
      } else {
        // Crear
        const res = await crearEmpleado({
          nombreEmpleado:   form.nombre,
          apellidoEmpleado: form.apellido,
          telefonoEmpleado: form.telefono,
          cargoEmpleado:    form.cargo,
          salarioEmpleado:  form.salario,
          usuario:          form.usuario,
          contrasena:       form.contrasena,
          tipoUsuario:      form.tipoUsuario,
        });
        if (res.message) {
          setError(res.message);
          return;
        }
      }
      await cargarEmpleados();
      setVista(null);
    } catch {
      setError("Error al guardar el empleado.");
    }
  };

  const handleEliminar = async () => {
    setError("");
    try {
      await Promise.all(selected.map((id) => eliminarEmpleado(id)));
      await cargarEmpleados();
      setSelected([]);
      setPagina(1);
    } catch {
      setError("Error al eliminar empleados.");
    }
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
        usuario={usuario} 
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            breadcrumb={["Personal", "Empleados"]}
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
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>
            Empleados
          </h1>

          {error && (
            <p className="text-sm text-red-500 mb-4">{error}</p>
          )}

          {loading ? (
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>Cargando empleados...</p>
          ) : vista ? (
            <EmpleadoForm
              empleado={empleadoEditando}
              onSave={handleGuardar}
              onCancel={() => { setVista(null); setError(""); }}
            />
          ) : (
            <>
              <EmpleadosToolbar
                selected={selected}
                onAgregar={() => setVista("nuevo")}
                onEliminar={handleEliminar}
                busqueda={busqueda}
                onBusqueda={(val) => { setBusqueda(val); setPagina(1); }}
                onToggleOrden={toggleOrdenGlobal}
                onImprimir={() => window.print()}
                empleados={filtrados}  
              />
              <EmpleadosTable
                visibles={visibles}
                selected={selected}
                allChecked={allChecked}
                onToggleAll={toggleAll}
                onToggleOne={toggleOne}
                onEditar={(e) => setVista(e)}
                ordenCol={ordenCol}
                ordenDir={ordenDir}
                onOrdenar={ordenarPorColumna}
              />
              <EmpleadosPagination
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
          productosVencer={notifs.productosVencer}
          productosAgotar={notifs.productosAgotar}
          onClose={() => setNotifOpen(false)}
        />
      )}
    </div>
  );
}