import { Filter, Pencil, Calendar } from "lucide-react";
import { COLORS } from "../../constants/colors";

const COLUMNAS = ["Nombre", "Medida", "Stock actual", "Stock mínimo", "Precio compra", "Vencimiento", "Última compra"];

function formatFecha(fecha) {
  if (!fecha) return "";
  const [y, m, d] = fecha.split("-");
  const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Agos","Sep","Oct","Nov","Dic"];
  return `${meses[parseInt(m) - 1]} ${d}, ${y}`;
}

export function InsumosTable({ visibles, selected, allChecked, onToggleAll, onToggleOne, onEditar }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>

      <div
        className="grid grid-cols-[2.5rem_2fr_1fr_1fr_1fr_1.2fr_1.5fr_1.5fr_2.5rem] border-b"
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
          No se encontraron insumos.
        </div>
      ) : (
        visibles.map((ins) => (
          <div
            key={ins.id}
            className="grid grid-cols-[2.5rem_2fr_1fr_1fr_1fr_1.2fr_1.5fr_1.5fr_2.5rem] border-b last:border-0 transition-colors"
            style={{
              borderColor:     COLORS.borderColor,
              backgroundColor: selected.includes(ins.id) ? "#f0f4ff" : "#ffffff",
            }}
            onMouseEnter={(e) => {
              if (!selected.includes(ins.id))
                e.currentTarget.style.backgroundColor = COLORS.rowHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selected.includes(ins.id)
                ? "#f0f4ff" : "#ffffff";
            }}
          >
            <div className="flex items-center justify-center px-3 py-3.5">
              <input
                type="checkbox"
                checked={selected.includes(ins.id)}
                onChange={() => onToggleOne(ins.id)}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              {ins.nombre}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              {ins.medida}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              {ins.stockActual}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              {ins.stockMinimo}
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>
              $ {ins.precioCompra.toFixed(2)}
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              <Calendar size={13} />
              {formatFecha(ins.vencimiento)}
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>
              <Calendar size={13} />
              {formatFecha(ins.ultimaCompra)}
            </div>
            <div className="flex items-center justify-center px-3 py-3.5">
              <button
                onClick={() => onEditar(ins)}
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