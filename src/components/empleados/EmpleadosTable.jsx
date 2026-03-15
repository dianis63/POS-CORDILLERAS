import { Filter, Pencil } from "lucide-react";
import { COLORS } from "../../constants/colors";

const COLUMNAS = ["Nombre", "Apellido", "Teléfono", "Cargo", "Salario"];

export function EmpleadosTable({ visibles, selected, allChecked, onToggleAll, onToggleOne, onEditar }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>

      <div
        className="grid grid-cols-[2.5rem_1.5fr_1.5fr_1fr_1.2fr_1.2fr_2.5rem] border-b"
        style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}
      >
        <div className="flex items-center justify-center px-3 py-3">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={onToggleAll}
            className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
          />
        </div>
        {COLUMNAS.map((col) => (
          <div
            key={col}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
            style={{ color: COLORS.textSecondary }}
          >
            {col} <Filter size={11} style={{ opacity: 0.5 }} />
          </div>
        ))}
        <div className="flex items-center justify-center px-3 py-3">
          <Filter size={11} style={{ color: COLORS.textSecondary, opacity: 0.5 }} />
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="py-12 text-center text-sm" style={{ color: COLORS.textSecondary }}>
          No se encontraron empleados.
        </div>
      ) : (
        visibles.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-[2.5rem_1.5fr_1.5fr_1fr_1.2fr_1.2fr_2.5rem] border-b last:border-0 transition-colors"
            style={{
              borderColor:     COLORS.borderColor,
              backgroundColor: selected.includes(e.id) ? "#f0f4ff" : "#ffffff",
            }}
            onMouseEnter={(ev) => {
              if (!selected.includes(e.id))
                ev.currentTarget.style.backgroundColor = COLORS.rowHover;
            }}
            onMouseLeave={(ev) => {
              ev.currentTarget.style.backgroundColor = selected.includes(e.id)
                ? "#f0f4ff" : "#ffffff";
            }}
          >
            <div className="flex items-center justify-center px-3 py-3.5">
              <input
                type="checkbox"
                checked={selected.includes(e.id)}
                onChange={() => onToggleOne(e.id)}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              {e.nombre}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              {e.apellido}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              {e.telefono}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              {e.cargo}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              $ {e.salario.toFixed(2)}
            </div>
            <div className="flex items-center justify-center px-3 py-3.5">
              <button
                onClick={() => onEditar(e)}
                className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Pencil size={14} style={{ color: COLORS.textSecondary }} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}