import { ArrowUpDown, Plus, Minus, Printer, Search, Filter } from "lucide-react";
import { COLORS } from "../../constants/colors";

export function EmpleadosToolbar({ selected, onAgregar, onEliminar, busqueda, onBusqueda, onToggleOrden, onImprimir }) {
  return (
    <div
      className="flex items-center justify-between mb-4 px-4 py-3 rounded-xl border"
      style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleOrden}
          className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
          style={{ borderColor: COLORS.borderColor }}
          title="Invertir orden"
        >
          <ArrowUpDown size={15} style={{ color: COLORS.textSecondary }} />
        </button>

        <button
          onClick={onAgregar}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: COLORS.accentBlue }}
        >
          <Plus size={15} />
          Agregar
        </button>

        <button
          onClick={onEliminar}
          disabled={selected.length === 0}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-medium transition-colors"
          style={{
            backgroundColor: selected.length > 0 ? COLORS.accentRedLight : "#f3f4f6",
            color:           selected.length > 0 ? COLORS.accentRed      : COLORS.textSecondary,
            opacity:         selected.length > 0 ? 1 : 0.6,
            cursor:          selected.length > 0 ? "pointer" : "not-allowed",
          }}
        >
          <Minus size={15} />
          Eliminar
          {selected.length > 0 && (
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: COLORS.accentRed, color: "#fff" }}
            >
              {selected.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onImprimir}
          className="p-2 rounded-lg border hover:bg-gray-100 transition-colors"
          style={{ borderColor: COLORS.borderColor }}
          title="Imprimir"
        >
          <Printer size={15} style={{ color: COLORS.textSecondary }} />
        </button>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}
        >
          <Search size={13} style={{ color: COLORS.textSecondary }} />
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
            className="outline-none bg-transparent text-sm w-36"
            style={{ color: COLORS.textPrimary }}
          />
        </div>
      </div>
    </div>
  );
}