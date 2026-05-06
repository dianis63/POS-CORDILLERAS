import { useState } from "react";
import {
  PanelLeftClose, PanelLeftOpen, Search,
  RefreshCw, Bell, CircleUserRound,
} from "lucide-react";
import { COLORS } from "../../constants/colors";

export function Topbar({ sidebarOpen, setSidebarOpen, breadcrumb, notifOpen, setNotifOpen }) {
  const [busqueda, setBusqueda] = useState("");

  return (
    <header
      className="topbar flex items-center justify-between px-6 border-b flex-shrink-0"
      style={{
        backgroundColor: COLORS.topbarBg,
        borderColor:     COLORS.borderColor,
        height:          "49px",
      }}
    >
      {/* Izquierda */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen
            ? <PanelLeftClose size={18} style={{ color: COLORS.textSecondary }} />
            : <PanelLeftOpen  size={18} style={{ color: COLORS.textSecondary }} />}
        </button>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm" style={{ color: COLORS.textSecondary }}>
          {breadcrumb.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              <span
                className={i === breadcrumb.length - 1 ? "font-medium" : ""}
                style={{
                  color: i === breadcrumb.length - 1
                    ? COLORS.textPrimary
                    : COLORS.textSecondary,
                }}
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Derecha */}
      <div className="flex items-center gap-3">
        {/* Buscador */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm"
          style={{ borderColor: COLORS.borderColor, backgroundColor: "#f9fafb" }}
        >
          <Search size={14} style={{ color: COLORS.textSecondary }} />
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="outline-none bg-transparent text-sm w-32"
            style={{ color: COLORS.textPrimary }}
          />
        </div>

        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <RefreshCw size={16} style={{ color: COLORS.textSecondary }} />
        </button>

        {/* Campana */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors relative"
          >
            <Bell
              size={16}
              style={{ color: notifOpen ? COLORS.accentBlue : COLORS.textSecondary }}
            />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
        </div>

        <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <CircleUserRound size={18} style={{ color: COLORS.textSecondary }} />
        </button>
      </div>
    </header>
  );
}