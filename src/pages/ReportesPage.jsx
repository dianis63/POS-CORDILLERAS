import { useState, useEffect, useCallback } from "react";
import { Sidebar }    from "../components/layout/Sidebar";
import { Topbar }     from "../components/layout/Topbar";
import { NotifPanel } from "../components/dashboard/NotifPanel";
import {
    getVentasTotales, getVentasProductos,
    getVentasCategorias, getAuditoria,
    registrarAcceso, registrarDescarga,
} from "../api/reporteApi";
import { COLORS } from "../constants/colors";
import {
    Calendar, Clock, Printer,
    ArrowUpDown, ChevronLeft, ChevronRight,
    ChevronUp, ChevronDown, Filter,
} from "lucide-react";

const TABS = [
    { label: "Ventas totales",        idTipo: 1    },
    { label: "Ventas por productos",  idTipo: 2    },
    { label: "Ventas por categoría",  idTipo: 3    },
    { label: "Auditoria de reportes", idTipo: null },
];
const PER_PAGE = 10;

function formatFecha(fecha) {
    if (!fecha) return "";
    const d = new Date(fecha);
    const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
    return `${meses[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2,"0")}, ${d.getUTCFullYear()}`;
}

function formatHora(hora) {
    if (!hora) return "";
    const h = hora.slice(0, 5);
    const [hh, mm] = h.split(":");
    const n = parseInt(hh);
    const ampm = n >= 12 ? "p.m." : "a.m.";
    const h12  = n % 12 || 12;
    return `${String(h12).padStart(2, "0")}:${mm} ${ampm}`;
}

function SortIcon({ col, ordenCol, ordenDir }) {
    if (ordenCol !== col) return <Filter size={11} style={{ opacity: 0.4 }} />;
    return ordenDir === "asc"
        ? <ChevronUp   size={13} style={{ color: COLORS.accentBlue }} />
        : <ChevronDown size={13} style={{ color: COLORS.accentBlue }} />;
}

function useSorting(defaultCol) {
    const [ordenCol, setOrdenCol] = useState(defaultCol);
    const [ordenDir, setOrdenDir] = useState("asc");

    const ordenar = (col) => {
        if (ordenCol === col) setOrdenDir((d) => d === "asc" ? "desc" : "asc");
        else { setOrdenCol(col); setOrdenDir("asc"); }
    };

    const toggleDir = () => setOrdenDir((d) => d === "asc" ? "desc" : "asc");

    const sortData = (data) => [...data].sort((a, b) => {
    const va = a[ordenCol] ?? "";
    const vb = b[ordenCol] ?? "";

    

    const na = Number(va);
    const nb = Number(vb);
    if (!isNaN(na) && !isNaN(nb) && va !== "" && vb !== "") {
        return ordenDir === "asc" ? na - nb : nb - na;
    }
    return ordenDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
});

    return { ordenCol, ordenDir, ordenar, toggleDir, sortData };
}

function Paginacion({ paginaActual, totalPaginas, onCambiar }) {
    return (
        <div className="flex items-center justify-end gap-1 mt-4">
            <button onClick={() => onCambiar((p) => Math.max(1, p - 1))} disabled={paginaActual === 1}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30">
                <ChevronLeft size={16} style={{ color: COLORS.textSecondary }} />
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => onCambiar(n)}
                    className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
                    style={{
                        backgroundColor: n === paginaActual ? COLORS.accentBlue : "transparent",
                        color:           n === paginaActual ? "#ffffff" : COLORS.textSecondary,
                    }}>
                    {n}
                </button>
            ))}
            <button onClick={() => onCambiar((p) => Math.min(totalPaginas, p + 1))} disabled={paginaActual === totalPaginas}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30">
                <ChevronRight size={16} style={{ color: COLORS.textSecondary }} />
            </button>
        </div>
    );
}

function Toolbar({ fecha, onFecha, onToggleOrden, onImprimir  }) {
    return (
        <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl border"
            style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}>
            <div className="flex items-center gap-2">
                <button onClick={onToggleOrden} className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
                    style={{ borderColor: COLORS.borderColor }} title="Invertir orden">
                    <ArrowUpDown size={15} style={{ color: COLORS.textSecondary }} />
                </button>
                <button onClick={onImprimir} className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
                    style={{ borderColor: COLORS.borderColor }}>
                    <Printer size={15} style={{ color: COLORS.textSecondary }} />
                </button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
                style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
                <Calendar size={13} style={{ color: COLORS.textSecondary }} />
                <input type="date" value={fecha}
                    onChange={(e) => onFecha(e.target.value)}
                    className="outline-none bg-transparent text-sm"
                    style={{ color: COLORS.textPrimary }} />
            </div>
        </div>
    );
}

// ── Columnas por tabla ──────────────────────────────────────────
const COLS_TOTALES = [
    { label: "ID venta",          key: "id"               },
    { label: "Cliente",           key: "cliente"          },
    { label: "Cantidad productos",key: "cantidadproductos"},
    { label: "Total venta",       key: "totalventa"       },
    { label: "Fecha",             key: "fecha"            },
    { label: "Hora",              key: "hora"             },
];

const COLS_PRODUCTOS = [
    { label: "Nombre",           key: "nombre"           },
    { label: "Cantidad productos",key:"cantidadproductos"},
    { label: "Tamaño",           key: "tamanio"          },
    { label: "Precio unitario",  key: "preciounitario"   },
    { label: "Total",            key: "total"            },
    { label: "Fecha",            key: "fecha"            },
];

const COLS_CATEGORIAS = [
    { label: "Categoría",        key: "categoria"        },
    { label: "Cantidad productos",key:"cantidadproductos"},
    { label: "Total",            key: "total"            },
    { label: "Fecha",            key: "fecha"            },
];

const COLS_AUDITORIA = [
    { label: "ID reporte",       key: "idreporte"        },
    { label: "ID usuario",       key: "idusuario"        },
    { label: "Tipo de reporte",  key: "tiporeporte"      },
     { label: "Acción",           key: "accion"           },
    { label: "Fecha del reporte",key: "fechareporte"     },
];

// ── Cabecera reutilizable ───────────────────────────────────────
function Cabecera({ cols, gridCols, ordenCol, ordenDir, onOrdenar }) {
    return (
        <div className={`grid ${gridCols} border-b`}
            style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}>
            {cols.map(({ label, key }) => (
                <div key={key} onClick={() => onOrdenar(key)}
                    className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none hover:bg-gray-50 transition-colors"
                    style={{ color: ordenCol === key ? COLORS.accentBlue : COLORS.textSecondary }}>
                    {label}
                    <SortIcon col={key} ordenCol={ordenCol} ordenDir={ordenDir} />
                </div>
            ))}
        </div>
    );
}

// ── Tablas ──────────────────────────────────────────────────────
function TablaVentasTotales({ data, loading, ordenCol, ordenDir, onOrdenar, sortData }) {
    const [pagina, setPagina] = useState(1);
    const sorted    = sortData(data);
    const total     = data.reduce((s, r) => s + Number(r.totalventa), 0);
    const totalPags = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
    const visibles  = sorted.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

    if (loading) return <p className="text-sm py-6 text-center" style={{ color: COLORS.textSecondary }}>Cargando...</p>;

    return (
        <>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
                <Cabecera cols={COLS_TOTALES} gridCols="grid-cols-[1.2fr_1.5fr_1.2fr_1.2fr_1.5fr_1fr]"
                    ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={onOrdenar} />
                {visibles.length === 0 ? (
                    <div className="py-12 text-center text-sm" style={{ color: COLORS.textSecondary }}>
                        No hay ventas para esta fecha.
                    </div>
                ) : visibles.map((r) => (
                    <div key={r.id} className="grid grid-cols-[1.2fr_1.5fr_1.2fr_1.2fr_1.5fr_1fr] border-b last:border-0"
                        style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.id}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
                            {r.cliente}
                        </div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.cantidadproductos}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {Number(r.totalventa).toFixed(2)}</div>
                        <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
                            <Calendar size={13} />{formatFecha(r.fecha)}
                        </div>
                        <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
                            <Clock size={13} />{formatHora(r.hora)}
                        </div>
                    </div>
                ))}
            </div>
            <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
            <div className="mt-3 px-4 py-3 rounded-xl flex justify-end gap-8" style={{ backgroundColor: COLORS.cardBg }}>
                <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Cantidad de ventas: {data.length}</span>
                <span className="text-sm font-bold"   style={{ color: COLORS.textPrimary }}>Total: ${total.toFixed(2)}</span>
            </div>
        </>
    );
}

function TablaVentasProductos({ data, loading, ordenCol, ordenDir, onOrdenar, sortData }) {
    const [pagina, setPagina] = useState(1);
    const sorted        = sortData(data);
    const totalCantidad = data.reduce((s, r) => s + Number(r.cantidadproductos), 0);
    const total         = data.reduce((s, r) => s + Number(r.total), 0);
    const totalPags     = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
    const visibles      = sorted.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

    if (loading) return <p className="text-sm py-6 text-center" style={{ color: COLORS.textSecondary }}>Cargando...</p>;

    return (
        <>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
                <Cabecera cols={COLS_PRODUCTOS} gridCols="grid-cols-[2fr_1.2fr_1fr_1.2fr_1fr_1.5fr]"
                    ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={onOrdenar} />
                {visibles.length === 0 ? (
                    <div className="py-12 text-center text-sm" style={{ color: COLORS.textSecondary }}>
                        No hay productos vendidos para esta fecha.
                    </div>
                ) : visibles.map((r, i) => (
                    <div key={i} className="grid grid-cols-[2fr_1.2fr_1fr_1.2fr_1fr_1.5fr] border-b last:border-0"
                        style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.nombre}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.cantidadproductos}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>{r.tamanio}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {Number(r.preciounitario).toFixed(2)}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {Number(r.total).toFixed(2)}</div>
                        <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
                            <Calendar size={13} />{formatFecha(r.fecha)}
                        </div>
                    </div>
                ))}
            </div>
            <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
            <div className="mt-3 px-4 py-3 rounded-xl flex justify-end gap-8" style={{ backgroundColor: COLORS.cardBg }}>
                <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Cantidad de productos vendidos: {totalCantidad}</span>
                <span className="text-sm font-bold"   style={{ color: COLORS.textPrimary }}>Total: ${total.toFixed(2)}</span>
            </div>
        </>
    );
}

function TablaVentasCategorias({ data, loading, ordenCol, ordenDir, onOrdenar, sortData }) {
    const [pagina, setPagina] = useState(1);
    const sorted    = sortData(data);
    const total     = data.reduce((s, r) => s + Number(r.total), 0);
    const totalPags = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
    const visibles  = sorted.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

    if (loading) return <p className="text-sm py-6 text-center" style={{ color: COLORS.textSecondary }}>Cargando...</p>;

    return (
        <>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
                <Cabecera cols={COLS_CATEGORIAS} gridCols="grid-cols-[2fr_1.2fr_1fr_1.5fr]"
                    ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={onOrdenar} />
                {visibles.length === 0 ? (
                    <div className="py-12 text-center text-sm" style={{ color: COLORS.textSecondary }}>
                        No hay ventas por categoría para esta fecha.
                    </div>
                ) : visibles.map((r, i) => (
                    <div key={i} className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr] border-b last:border-0"
                        style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.categoria}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.cantidadproductos}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {Number(r.total).toFixed(2)}</div>
                        <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
                            <Calendar size={13} />{formatFecha(r.fecha)}
                        </div>
                    </div>
                ))}
            </div>
            <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
            <div className="mt-3 px-4 py-3 rounded-xl flex justify-end" style={{ backgroundColor: COLORS.cardBg }}>
                <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>Total: ${total.toFixed(2)}</span>
            </div>
        </>
    );
}

function TablaAuditoria({ data, loading, ordenCol, ordenDir, onOrdenar, sortData }) {
    const [pagina, setPagina] = useState(1);
    const sorted    = sortData(data);
    const totalPags = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
    const visibles  = sorted.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

    if (loading) return <p className="text-sm py-6 text-center" style={{ color: COLORS.textSecondary }}>Cargando...</p>;

    return (
        <>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
                <Cabecera cols={COLS_AUDITORIA} gridCols="grid-cols-[1.2fr_1.2fr_2fr_1fr_1.5fr]"
                    ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={onOrdenar} />
                {visibles.map((r, i) => (
                    <div key={i} className="grid grid-cols-[1.2fr_1.2fr_2fr_1fr_1.5fr] border-b last:border-0"
                        style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.idreporte}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.idusuario}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.tiporeporte}</div>
                        <div className="flex items-center px-4 py-3.5 text-sm">
                            <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: r.accion === 'GENERADO' ? '#dcfce7' : '#eff6ff',
                                    color:           r.accion === 'GENERADO' ? '#16a34a' : '#3b82f6',
                                }}
                            >
                                {r.accion}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
                            <Calendar size={13} />{formatFecha(r.fechareporte)}
                        </div>
                    </div>
                ))}
            </div>
            <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
        </>
    );
}

// ── Page ────────────────────────────────────────────────────────
const DEFAULT_COLS = ["id", "nombre", "categoria", "idreporte"];

export default function ReportesPage({ currentPage, onNavigate, onLogout, usuario, notifs, refrescarNotifs}) {
    const [tabActiva,   setTabActiva]   = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifOpen,   setNotifOpen]   = useState(false);
    const [fecha,       setFecha]       = useState("");
    const [data,        setData]        = useState([]);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState("");

    const { ordenCol, ordenDir, ordenar, toggleDir, sortData } = useSorting(DEFAULT_COLS[tabActiva]);

    const cargarDatos = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            let result = [];
            if (tabActiva === 0) {
                result = await getVentasTotales(fecha || null);
                if (TABS[0].idTipo) registrarAcceso(TABS[0].idTipo).catch(() => {});
            } else if (tabActiva === 1) {
                result = await getVentasProductos(fecha || null);
                if (TABS[1].idTipo) registrarAcceso(TABS[1].idTipo).catch(() => {});
            } else if (tabActiva === 2) {
                result = await getVentasCategorias(fecha || null);
                if (TABS[2].idTipo) registrarAcceso(TABS[2].idTipo).catch(() => {});
            } else {
                result = await getAuditoria(fecha || null);
            }
            setData(result);
        } catch {
            setError("Error al cargar el reporte.");
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [tabActiva, fecha]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const handleTab = (i) => {
        setTabActiva(i);
        setData([]);
    };

    const sortingProps = { ordenCol, ordenDir, onOrdenar: ordenar, sortData };

    return (
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: COLORS.pageBg }}>
            <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout}
                sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} usuario={usuario} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            breadcrumb={["Dashboard", "Reportes"]}
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
                    <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>Reportes</h1>

                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                    <div className="flex gap-2 mb-5">
                        {TABS.map((tab, i) => (
                            <button key={tab.label} onClick={() => handleTab(i)}
                                className="px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                                style={{
                                    backgroundColor: i === tabActiva ? COLORS.accentBlue : COLORS.cardBg,
                                    color:           i === tabActiva ? "#ffffff" : COLORS.textSecondary,
                                    border:          `1px solid ${i === tabActiva ? COLORS.accentBlue : COLORS.borderColor}`,
                                }}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <Toolbar
                        fecha={fecha}
                        onFecha={setFecha}
                        onToggleOrden={toggleDir}
                        onImprimir={() => {
                            const idTipo = TABS[tabActiva]?.idTipo;
                            if (idTipo) registrarDescarga(idTipo).catch(() => {});
                            window.print();
                        }}
                    />

                    {tabActiva === 0 && <TablaVentasTotales    data={data} loading={loading} {...sortingProps} />}
                    {tabActiva === 1 && <TablaVentasProductos  data={data} loading={loading} {...sortingProps} />}
                    {tabActiva === 2 && <TablaVentasCategorias data={data} loading={loading} {...sortingProps} />}
                    {tabActiva === 3 && <TablaAuditoria        data={data} loading={loading} {...sortingProps} />}
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