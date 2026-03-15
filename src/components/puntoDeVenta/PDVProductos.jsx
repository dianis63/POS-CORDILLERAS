import { PlusCircle, Search } from "lucide-react";
import { useState }           from "react";
import { COLORS }             from "../../constants/colors";

export function PDVProductos({ productos, categoriaActiva, onAgregar }) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = productos.filter(
    (p) =>
      p.categoria === categoriaActiva &&
      p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const labelCategoria = {
    "bebidas-frias":     "Bebidas frías",
    "bebidas-calientes": "Bebidas calientes",
    postres:             "Postres",
    pizzas:              "Pizzas",
  };

  return (
    <div
      className="flex-1 rounded-2xl border overflow-hidden"
      style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.pdvCardBg }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 border-b"
        style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.cardBg }}
      >
        <p className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
          {labelCategoria[categoriaActiva] ?? "Productos"}
        </p>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm"
          style={{ borderColor: COLORS.borderColor, backgroundColor: "#ffffff" }}
        >
          <Search size={13} style={{ color: COLORS.textSecondary }} />
          <input
            type="text"
            placeholder="Buscar"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="outline-none bg-transparent text-sm w-28"
            style={{ color: COLORS.textPrimary }}
          />
        </div>
      </div>

      {/* Lista */}
      {filtrados.length === 0 ? (
        <div className="py-12 text-center text-sm" style={{ color: COLORS.textSecondary }}>
          No hay productos en esta categoría.
        </div>
      ) : (
        filtrados.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between px-5 py-3.5 border-b last:border-0 transition-colors"
            style={{ borderColor: COLORS.borderColor }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = COLORS.rowHover)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <span className="text-sm" style={{ color: COLORS.textPrimary }}>
              {p.nombre}
            </span>
            <div className="flex items-center gap-6">
              {p.talla && (
                <span className="text-sm" style={{ color: COLORS.textSecondary }}>
                  {p.talla}
                </span>
              )}
              <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                $ {p.precio.toFixed(2)}
              </span>
              <button
                onClick={() => onAgregar(p)}
                className="transition-opacity hover:opacity-70"
              >
                <PlusCircle size={22} style={{ color: COLORS.accentBlue }} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}