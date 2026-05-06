import { Filter, Pencil, ChevronUp, ChevronDown } from "lucide-react";
import { COLORS } from "../../constants/colors";

const COLUMNAS = [
  { label: "Nombre",          key: "nombre"         },
  { label: "Categoría",       key: "categoria"       },
  { label: "Precio unitario", key: "precioUnitario"  },
  { label: "Tamaño",          key: "tamanio"         },
  { label: "Estado",          key: "estado"          },
];

function SortIcon({ col, ordenCol, ordenDir }) {
  if (ordenCol !== col) return <Filter size={11} style={{ opacity: 0.5 }} />;
  return ordenDir === "asc"
    ? <ChevronUp   size={13} style={{ color: COLORS.accentBlue }} />
    : <ChevronDown size={13} style={{ color: COLORS.accentBlue }} />;
}

function EstadoBadge({ estado }) {
  const activo = estado === "Activo";
  return (
    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{
        backgroundColor: activo ? "#d1fae5" : "#fee2e2",
        color:           activo ? "#065f46" : "#991b1b",
      }}>
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}

export function ProductosTable({ visibles, selected, allChecked, onToggleAll, onToggleOne, onEditar, ordenCol, ordenDir, onOrdenar }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: COLORS.borderColor }}>
      <div className="grid grid-cols-[2.5rem_2fr_1.5fr_1.2fr_1fr_1fr_2.5rem] border-b"
        style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}>
        <div className="flex items-center justify-center px-3 py-3">
          <input type="checkbox" checked={allChecked} onChange={onToggleAll}
            className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
        </div>
        {COLUMNAS.map(({ label, key }) => (
          <div key={key} onClick={() => onOrdenar(key)}
            className="flex items-center gap-1.5 px-4 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none hover:bg-gray-50 transition-colors"
            style={{ color: ordenCol === key ? COLORS.accentBlue : COLORS.textSecondary }}>
            {label} <SortIcon col={key} ordenCol={ordenCol} ordenDir={ordenDir} />
          </div>
        ))}
        <div className="flex items-center justify-center px-3 py-3">
          <Filter size={11} style={{ color: COLORS.textSecondary, opacity: 0.5 }} />
        </div>
      </div>

      {visibles.length === 0 ? (
        <div className="py-12 text-center text-sm" style={{ color: COLORS.textSecondary }}>
          No se encontraron productos.
        </div>
      ) : (
        visibles.map((p) => (
          <div key={p.id}
            className="grid grid-cols-[2.5rem_2fr_1.5fr_1.2fr_1fr_1fr_2.5rem] border-b last:border-0 transition-colors"
            style={{ borderColor: COLORS.borderColor, backgroundColor: selected.includes(p.id) ? "#f0f4ff" : "#ffffff" }}
            onMouseEnter={(e) => { if (!selected.includes(p.id)) e.currentTarget.style.backgroundColor = COLORS.rowHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = selected.includes(p.id) ? "#f0f4ff" : "#ffffff"; }}>
            <div className="flex items-center justify-center px-3 py-3.5">
              <input type="checkbox" checked={selected.includes(p.id)} onChange={() => onToggleOne(p.id)}
                className="w-4 h-4 rounded accent-blue-500 cursor-pointer" />
            </div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{p.nombre}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>{p.categoria}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textPrimary }}>$ {p.precioUnitario.toFixed(2)}</div>
            <div className="flex items-center px-4 py-3.5 text-sm" style={{ color: COLORS.textSecondary }}>{p.tamanio}</div>
            <div className="flex items-center px-4 py-3.5"><EstadoBadge estado={p.estado} /></div>
            <div className="flex items-center justify-center px-3 py-3.5">
              <button onClick={() => onEditar(p)} className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors">
                <Pencil size={14} style={{ color: COLORS.textSecondary }} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}