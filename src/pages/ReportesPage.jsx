import { useState }    from "react";
import { Sidebar }     from "../components/layout/Sidebar";
import { Topbar }      from "../components/layout/Topbar";
import { NotifPanel }  from "../components/dashboard/NotifPanel";
import {
  ventasTotalesData, ventasProductosData,
  ventasCategoriasData, auditoriaData,
  productosVencer, productosAgotar,
} from "../data/mockData";
import { COLORS }      from "../constants/colors";
import { Filter, Calendar, Clock, Printer, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";

const TABS     = ["Ventas totales", "Ventas por productos", "Ventas por categoría", "Auditoria de reportes"];
const PER_PAGE = 10;

function formatFecha(fecha) {
  if (!fecha) return "";
  const [y, m, d] = fecha.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Agos","Sep","Oct","Nov","Dic"];
  return `${meses[parseInt(m) - 1]} ${d}, ${y}`;
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

function Toolbar({ fecha, onFecha }) {
  return (
    <div className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl border"
      style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
          style={{ borderColor: COLORS.borderColor }}>
          <ArrowUpDown size={15} style={{ color: COLORS.textSecondary }} />
        </button>
        <button className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
          style={{ borderColor: COLORS.borderColor }}>
          <Printer size={15} style={{ color: COLORS.textSecondary }} />
        </button>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
        style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
        <Calendar size={13} style={{ color: COLORS.textSecondary }} />
        <input
          type="date" value={fecha}
          onChange={(e) => onFecha(e.target.value)}
          className="outline-none bg-transparent text-sm"
          style={{ color: COLORS.textPrimary }}
        />
      </div>
    </div>
  );
}

function TablaVentasTotales({ data }) {
  const [pagina, setPagina] = useState(1);
  const total     = data.reduce((s, r) => s + r.totalVenta, 0);
  const totalPags = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const visibles  = data.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

  return (
    <>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
        <div className="grid grid-cols-[1.2fr_1.5fr_1.2fr_1.2fr_1.5fr_1fr] border-b"
          style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}>
          {["ID venta","Cliente","Cantidad productos","Total venta","Fecha","Hora"].map((col) => (
            <div key={col} className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: COLORS.textSecondary }}>
              {col} <Filter size={11} style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
        {visibles.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.2fr_1.5fr_1.2fr_1.2fr_1.5fr_1fr] border-b last:border-0"
            style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.id}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.cliente}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.cantidadProductos}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {r.totalVenta.toFixed(2)}</div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              <Calendar size={13} />{formatFecha(r.fecha)}
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              <Clock size={13} />{r.hora}
            </div>
          </div>
        ))}
      </div>
      <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
      <div
        className="mt-3 px-4 py-3 rounded-xl flex justify-end gap-8"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Cantidad de ventas: {data.length}</span>
        <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>Total: ${total.toFixed(2)}</span>
      </div>
    </>
  );
}

function TablaVentasProductos({ data }) {
  const [pagina, setPagina] = useState(1);
  const totalCantidad = data.reduce((s, r) => s + r.cantidadProductos, 0);
  const total         = data.reduce((s, r) => s + r.total, 0);
  const totalPags     = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const visibles      = data.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

  return (
    <>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1.2fr_1fr_1.5fr] border-b"
          style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}>
          {["Nombre","Cantidad productos","Tamaño","Precio unitario","Total","Fecha"].map((col) => (
            <div key={col} className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: COLORS.textSecondary }}>
              {col} <Filter size={11} style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
        {visibles.map((r, i) => (
          <div key={i} className="grid grid-cols-[2fr_1.2fr_1fr_1.2fr_1fr_1.5fr] border-b last:border-0"
            style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.nombre}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.cantidadProductos}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>{r.tamanio}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {r.precioUnitario.toFixed(2)}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {r.total.toFixed(2)}</div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              <Calendar size={13} />{formatFecha(r.fecha)}
            </div>
          </div>
        ))}
      </div>
      <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
      <div
        className="mt-3 px-4 py-3 rounded-xl flex justify-end gap-8"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Cantidad de productos vendidos: {totalCantidad}</span>
        <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>Total: ${total.toFixed(2)}</span>
      </div>
    </>
  );
}

function TablaVentasCategorias({ data }) {
  const [pagina, setPagina] = useState(1);
  const total     = data.reduce((s, r) => s + r.total, 0);
  const totalPags = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const visibles  = data.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

  return (
    <>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
        <div className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr] border-b"
          style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}>
          {["Categoría","Cantidad productos","Total","Fecha"].map((col) => (
            <div key={col} className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: COLORS.textSecondary }}>
              {col} <Filter size={11} style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
        {visibles.map((r, i) => (
          <div key={i} className="grid grid-cols-[2fr_1.2fr_1fr_1.5fr] border-b last:border-0"
            style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.categoria}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.cantidadProductos}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {r.total.toFixed(2)}</div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              <Calendar size={13} />{formatFecha(r.fecha)}
            </div>
          </div>
        ))}
      </div>
      <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
      <div
        className="mt-3 px-4 py-3 rounded-xl flex justify-end"
        style={{ backgroundColor: COLORS.cardBg }}
      >
        <span className="text-sm font-bold" style={{ color: COLORS.textPrimary }}>Total: ${total.toFixed(2)}</span>
      </div>
    </>
  );
}

function TablaAuditoria({ data }) {
  const [pagina, setPagina] = useState(1);
  const totalPags = Math.max(1, Math.ceil(data.length / PER_PAGE));
  const visibles  = data.slice((pagina - 1) * PER_PAGE, pagina * PER_PAGE);

  return (
    <>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
        <div className="grid grid-cols-[1.2fr_1.2fr_2fr_1.5fr] border-b"
          style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}>
          {["ID reporte","ID usuario","Tipo de reporte","Fecha del reporte"].map((col) => (
            <div key={col} className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
              style={{ color: COLORS.textSecondary }}>
              {col} <Filter size={11} style={{ opacity: 0.5 }} />
            </div>
          ))}
        </div>
        {visibles.map((r, i) => (
          <div key={i} className="grid grid-cols-[1.2fr_1.2fr_2fr_1.5fr] border-b last:border-0"
            style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.idReporte}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.idUsuario}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{r.tipoReporte}</div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              <Calendar size={13} />{formatFecha(r.fechaReporte)}
            </div>
          </div>
        ))}
      </div>
      <Paginacion paginaActual={pagina} totalPaginas={totalPags} onCambiar={setPagina} />
    </>
  );
}

export default function ReportesPage({ currentPage, onNavigate, onLogout }) {
  const [tabActiva,   setTabActiva]   = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [fecha,       setFecha]       = useState("2027-01-01");

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
          breadcrumb={["Dashboard", "Reportes"]}
          notifOpen={notifOpen}
          setNotifOpen={setNotifOpen}
        />

        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-6">
            <h1 className="text-xl font-bold mb-5" style={{ color: COLORS.textPrimary }}>
              Reportes
            </h1>

            {/* Tabs */}
            <div className="flex gap-2 mb-5">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setTabActiva(i)}
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: i === tabActiva ? COLORS.accentBlue : COLORS.cardBg,
                    color:           i === tabActiva ? "#ffffff" : COLORS.textSecondary,
                    border:          `1px solid ${i === tabActiva ? COLORS.accentBlue : COLORS.borderColor}`,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Toolbar fecha={fecha} onFecha={setFecha} />

            {tabActiva === 0 && <TablaVentasTotales    data={ventasTotalesData}    />}
            {tabActiva === 1 && <TablaVentasProductos  data={ventasProductosData}  />}
            {tabActiva === 2 && <TablaVentasCategorias data={ventasCategoriasData} />}
            {tabActiva === 3 && <TablaAuditoria        data={auditoriaData}        />}
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