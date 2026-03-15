import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../../constants/colors";

export function CategoriasPagination({ paginaActual, totalPaginas, onCambiar }) {
  return (
    <div className="flex items-center justify-end gap-1 mt-4">
      <button
        onClick={() => onCambiar((p) => Math.max(1, p - 1))}
        disabled={paginaActual === 1}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
      >
        <ChevronLeft size={16} style={{ color: COLORS.textSecondary }} />
      </button>

      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => onCambiar(n)}
          className="w-8 h-8 rounded-lg text-sm font-medium transition-colors"
          style={{
            backgroundColor: n === paginaActual ? COLORS.accentBlue : "transparent",
            color:           n === paginaActual ? "#ffffff"          : COLORS.textSecondary,
          }}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => onCambiar((p) => Math.min(totalPaginas, p + 1))}
        disabled={paginaActual === totalPaginas}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
      >
        <ChevronRight size={16} style={{ color: COLORS.textSecondary }} />
      </button>
    </div>
  );
}