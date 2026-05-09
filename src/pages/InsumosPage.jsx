import { useState, useEffect }    from "react";
import { Sidebar }                from "../components/layout/Sidebar";
import { Topbar }                 from "../components/layout/Topbar";
import { InsumosToolbar }         from "../components/insumos/InsumosToolbar";
import { InsumosTable }           from "../components/insumos/InsumosTable";
import { InsumosPagination }      from "../components/insumos/InsumosPagination";
import { InsumoForm }             from "../components/insumos/InsumoForm";
import { NotifPanel }             from "../components/dashboard/NotifPanel";
import { getInsumos, crearInsumo, actualizarInsumo, eliminarInsumo } from "../api/insumoApi";
import { productosVencer, productosAgotar } from "../data/mockData";
import { COLORS }                 from "../constants/colors";

const PER_PAGE = 10;

export default function InsumosPage({ currentPage, onNavigate, onLogout, usuario, notifs, refrescarNotifs   }) {
  const [insumos,     setInsumos]     = useState([]);
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

  useEffect(() => { cargarInsumos(); }, []);

  const cargarInsumos = async () => {
    setLoading(true);
    try {
      const data = await getInsumos();
      setInsumos(data.map((i) => ({
        id:           i.idinsumo,
        nombre:       i.nombreinsumo,
        medida:       i.medidainsumo,
        stockActual:  Number(i.stockinsumo),
        stockMinimo:  Number(i.stockminimo),
        precioCompra: Number(i.precioinsumo),
        vencimiento:  i.fechavencimiento ? i.fechavencimiento.split("T")[0] : "",
        ultimaCompra: i.fechaultimacompra ? i.fechaultimacompra.split("T")[0] : "",
      })));
    } catch { setError("Error al cargar insumos."); }
    finally  { setLoading(false); }
  };

  const filtrados = insumos
    .filter(({ nombre, medida }) => {
      const q = busqueda.toLowerCase();
      return nombre.toLowerCase().includes(q) || medida.toLowerCase().includes(q);
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
  const ids          = visibles.map((i) => i.id);
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
        await actualizarInsumo(vista.id, {
          nombreInsumo:      form.nombre,
          medidaInsumo:      form.medida,
          stockInsumo:       form.stockActual,
          stockMinimo:       form.stockMinimo,
          precioInsumo:      form.precioCompra,
          fechaVencimiento:  form.vencimiento  || null,
          fechaUltimaCompra: form.ultimaCompra || null,
        });
      } else {
        const res = await crearInsumo({
          nombreInsumo:      form.nombre,
          medidaInsumo:      form.medida,
          stockInsumo:       form.stockActual,
          stockMinimo:       form.stockMinimo,
          precioInsumo:      form.precioCompra,
          fechaVencimiento:  form.vencimiento  || null,
          fechaUltimaCompra: form.ultimaCompra || null,
        });
        if (res.message) { setError(res.message); return; }
      }
      await cargarInsumos();
      setVista(null);
    } catch { setError("Error al guardar el insumo."); }
  };

  const handleEliminar = async () => {
    setError("");
    try {
      await Promise.all(selected.map((id) => eliminarInsumo(id)));
      await cargarInsumos();
      setSelected([]);
      setPagina(1);
    } catch { setError("Error al eliminar insumos."); }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.pageBg }}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout}
        sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} usuario={usuario} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            breadcrumb={["Inventario", "Insumos"]}
            notifOpen={notifOpen}
            setNotifOpen={(val) => {
                if (val) refrescarNotifs();
                setNotifOpen(val);
            }}
            esAdmin={usuario?.tipo?.toLowerCase() === "admin"}
             notifs={notifs}
 
        />

        <main className="flex-1 overflow-y-auto p-6">
          <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>Insumos</h1>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {loading ? (
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>Cargando insumos...</p>
          ) : vista ? (
            <InsumoForm
              insumo={vista !== "nuevo" ? vista : null}
              onSave={handleGuardar}
              onCancel={() => { setVista(null); setError(""); }}
            />
          ) : (
            <>
              <InsumosToolbar
                selected={selected}
                onAgregar={() => setVista("nuevo")}
                onEliminar={handleEliminar}
                busqueda={busqueda}
                onBusqueda={(val) => { setBusqueda(val); setPagina(1); }}
                onToggleOrden={toggleOrdenGlobal}
                onImprimir={() => window.print()}
              />
              <InsumosTable
                visibles={visibles} selected={selected} allChecked={allChecked}
                onToggleAll={toggleAll} onToggleOne={toggleOne} onEditar={(i) => setVista(i)}
                ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={ordenarPorColumna}
              />
              <InsumosPagination paginaActual={paginaActual} totalPaginas={totalPaginas} onCambiar={setPagina} />
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