import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  DollarSign, CheckSquare, ShoppingBag, Heart, Award,
} from "lucide-react";

import { Sidebar }         from "../components/layout/Sidebar";
import { Topbar }          from "../components/layout/Topbar";
import { StatCard }        from "../components/ui/statCard";
import { SectionCard }     from "../components/ui/sectionCard";
import { AlertRow }        from "../components/ui/alertRow";
import { NotifPanel }      from "../components/dashboard/NotifPanel";
import { getEstadisticas } from "../api/dashboardApi";
import { COLORS }          from "../constants/colors";

export default function DashboardPage({ currentPage, onNavigate, onLogout, usuario, notifs, refrescarNotifs   }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [stats,       setStats]       = useState(null);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    getEstadisticas()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { icon: DollarSign,  label: "Ingresos totales",   value: stats.ingresos           },
    { icon: DollarSign,  label: "Ingresos del día",   value: stats.ingresosHoy        },
    { icon: CheckSquare, label: "Pedidos completados", value: stats.pedidosCompletados },
    { icon: ShoppingBag, label: "Productos vendidos",  value: stats.productosVendidos  },
  ] : [];

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
            breadcrumb={["Dashboard", "Estadísticas"]}
            notifOpen={notifOpen}
            setNotifOpen={(val) => {
                if (val) refrescarNotifs();
                setNotifOpen(val);
            }}
            esAdmin={usuario?.tipo?.toLowerCase() === "admin"}
            notifs={notifs}
        />


        <main className="flex-1 overflow-y-auto p-6 space-y-5">
          <h1 className="text-xl font-bold" style={{ color: COLORS.textPrimary }}>
            Estadísticas
          </h1>

          {loading ? (
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>Cargando estadísticas...</p>
          ) : !stats ? (
            <p className="text-sm text-red-500">Error al cargar estadísticas.</p>
          ) : (
            <>
              {/* Stats */}
              <div className="flex gap-4">
                {STAT_CARDS.map((card, i) => (
                  <StatCard
                    key={card.label}
                    icon={card.icon}
                    label={card.label}
                    value={card.value}
                    bg={i % 2 === 0 ? COLORS.statCardBg : COLORS.statCardBg1}
                  />
                ))}
              </div>

              {/* Gráficas */}
              <div className="grid grid-cols-2 gap-4">
                <SectionCard title="Ventas diarias" legend="Última semana">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.ventasDiarias} barSize={22}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="dia" tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v) => [`$${v}`, "Ventas"]} cursor={{ fill: "#f0f4ff" }} />
                      <Bar dataKey="valor" fill={COLORS.barColorDaily} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </SectionCard>

                <SectionCard title="Ventas anuales" legend="Último año">
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={stats.ventasAnuales} barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="mes" tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: COLORS.textSecondary }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip formatter={(v) => [`$${v}`, "Ventas"]} cursor={{ fill: "#f0f4ff" }} />
                      <Bar dataKey="valor" fill={COLORS.barColorAnnual} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </SectionCard>
              </div>

              {/* Fila inferior */}
              <div className="grid grid-cols-3 gap-4 items-stretch">
                <SectionCard title="Ventas por categorías" className="flex flex-col">
                  <div className="flex gap-4 items-center flex-1">
                    <div className="flex-1 space-y-1.5">
                      {stats.categorias.length === 0 ? (
                        <p className="text-xs" style={{ color: COLORS.textSecondary }}>Sin datos</p>
                      ) : stats.categorias.map((c) => (
                        <div key={c.nombre} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                            <span className="text-xs" style={{ color: COLORS.textSecondary }}>{c.nombre}</span>
                          </div>
                          <span className="text-xs font-medium" style={{ color: COLORS.textPrimary }}>{c.porcentaje}%</span>
                        </div>
                      ))}
                    </div>
                    {stats.categorias.length > 0 && (
                      <PieChart width={90} height={90}>
                        <Pie data={stats.categorias} dataKey="porcentaje" cx="50%" cy="50%" innerRadius={25} outerRadius={42} strokeWidth={0}>
                          {stats.categorias.map((c, i) => <Cell key={i} fill={c.color} />)}
                        </Pie>
                      </PieChart>
                    )}
                  </div>
                </SectionCard>

                <SectionCard title="Productos más vendidos" legend="total" className="flex flex-col">
                    {stats.topProductos.length === 0 ? (
                      <p className="text-xs" style={{ color: COLORS.textSecondary }}>Sin datos</p>
                    ) : (
                      <ResponsiveContainer width="100%" height={160}>  {/* ← era 130 */}
                        <BarChart data={stats.topProductos} layout="vertical" barSize={12}>
                          <XAxis
                            type="number"
                            tick={{ fontSize: 10, fill: COLORS.textSecondary }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <YAxis
                            type="category"
                            dataKey="nombre"
                            tick={{ fontSize: 10, fill: COLORS.textSecondary }}
                            axisLine={false}
                            tickLine={false}
                            width={75}
                            tickFormatter={(v) => v.length > 10 ? `${v.slice(0, 10)}…` : v}
                          />
                          <Tooltip cursor={{ fill: "#f0f9f0" }} />
                          <Bar dataKey="valor" fill={COLORS.barColorProducts} radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </SectionCard>

                <div className="flex flex-col gap-4">
                  <div className="flex-1 rounded-2xl p-4 flex justify-between items-start" style={{ backgroundColor: COLORS.cardBg }}>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Producto favorito</p>
                      <p className="text-sm" style={{ color: COLORS.textSecondary }}>{stats.productoFavorito}</p>
                    </div>
                    <Heart size={18} strokeWidth={1.5} style={{ color: COLORS.textSecondary }} />
                  </div>
                  <div className="flex-1 rounded-2xl p-4 flex justify-between items-start" style={{ backgroundColor: COLORS.cardBg }}>
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: COLORS.textPrimary }}>Empleado del mes</p>
                      <p className="text-sm" style={{ color: COLORS.textSecondary }}>{stats.empleadoMes}</p>
                    </div>
                    <Award size={18} strokeWidth={1.5} style={{ color: COLORS.textSecondary }} />
                  </div>
                </div>
              </div>

              {/* Alertas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.cardBg }}>
                  <p className="text-sm font-semibold mb-3" style={{ color: COLORS.textPrimary }}>Productos por caducar</p>
                  {stats.productosVencerCard.length === 0 ? (
                    <p className="text-xs" style={{ color: COLORS.textSecondary }}>Sin alertas de vencimiento.</p>
                  ) : stats.productosVencerCard.map((p) => (
                    <AlertRow key={p.nombre} nombre={p.nombre} tiempo={p.tiempo} badge={p.dias} urgencia={p.urgencia} />
                  ))}
                </div>
                <div className="rounded-2xl p-5" style={{ backgroundColor: COLORS.cardBg }}>
                  <p className="text-sm font-semibold mb-3" style={{ color: COLORS.textPrimary }}>Productos por agotarse</p>
                  {stats.productosAgotarCard.length === 0 ? (
                    <p className="text-xs" style={{ color: COLORS.textSecondary }}>Sin alertas de stock.</p>
                  ) : stats.productosAgotarCard.map((p) => (
                    <AlertRow key={p.nombre} nombre={p.nombre} tiempo={p.tiempo} badge={p.unidades} urgencia={p.urgencia} />
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {notifOpen && stats && (
        <NotifPanel
          productosVencer={stats.productosVencer}
          productosAgotar={stats.productosAgotar}
          onClose={() => setNotifOpen(false)}
        />
      )}
    </div>
  );

}