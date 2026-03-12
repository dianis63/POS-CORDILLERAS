import { AlertTriangle } from "lucide-react";
import { COLORS } from "../../constants/colors";

function NotifItem({ nombre, tiempo, badge, urgencia, type }) {
  const bgMap   = { red: "#fee2e2", orange: "#ffedd5", gray: "#f3f4f6" };
  const textMap = { red: "#dc2626", orange: "#ea580c", gray: "#6b7280" };

  return (
    <div
      className="flex items-start gap-2 py-2 border-b last:border-0"
      style={{ borderColor: COLORS.borderColor }}
    >
      <AlertTriangle
        size={14}
        className="mt-0.5 flex-shrink-0"
        style={{ color: textMap[urgencia] ?? "#9ca3af" }}
      />
      <div>
        <p className="text-xs font-medium" style={{ color: COLORS.textPrimary }}>{nombre}</p>
        <p className="text-xs"             style={{ color: COLORS.textSecondary }}>{tiempo}</p>
        <span
          className="text-xs font-semibold px-1.5 py-0.5 rounded-full mt-0.5 inline-block"
          style={{
            backgroundColor: bgMap[urgencia]   ?? "#f3f4f6",
            color:           textMap[urgencia] ?? "#6b7280",
          }}
        >
          {badge}
        </span>
      </div>
    </div>
  );
}

export function NotifPanel({ productosVencer, productosAgotar }) {
  return (
    <aside
      className="w-56 flex-shrink-0 border-l p-4 space-y-4 overflow-y-auto"
      style={{
        borderColor:     COLORS.borderColor,
        backgroundColor: COLORS.topbarBg,
      }}
    >
      <p className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>
        Notificaciones
      </p>

      {/* Por caducar */}
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
          Por caducar
        </p>
        {productosVencer.map((p) => (
          <NotifItem
            key={p.nombre}
            nombre={p.nombre}
            tiempo={p.tiempo}
            badge={p.dias}
            urgencia={p.urgencia}
          />
        ))}
      </div>

      {/* Por agotarse */}
      <div>
        <p className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
          Por agotarse
        </p>
        {productosAgotar.map((p) => (
          <NotifItem
            key={p.nombre}
            nombre={p.nombre}
            tiempo={p.tiempo}
            badge={p.unidades}
            urgencia={p.urgencia}
          />
        ))}
      </div>
    </aside>
  );
}