import { COLORS } from "../../constants/colors";

export function PDVCategorias({ categorias, activa, onSeleccionar }) {
  return (
    <div className="flex gap-2 mb-4">
      {categorias.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onSeleccionar(cat.key)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150"
          style={{
            backgroundColor: activa === cat.key ? COLORS.pdvCategoryActiveBg  : "#ffffff",
            color:           activa === cat.key ? COLORS.pdvCategoryActiveText : COLORS.textSecondary,
            borderColor:     activa === cat.key ? COLORS.pdvCategoryActiveText : COLORS.pdvCategoryBorder,
          }}
        >
          <span>{cat.icon}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}