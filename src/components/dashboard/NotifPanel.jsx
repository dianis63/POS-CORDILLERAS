import { AlertTriangle, X } from "lucide-react";
import { COLORS } from "../../constants/colors";

function NotifItem({ nombre, tiempo, badge, urgencia }) {
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

export function NotifPanel({ productosVencer, productosAgotar, onClose }) {
  return (
    <>
      {/* Overlay para cerrar al hacer clic fuera */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className="fixed z-50 top-[49px] right-0 w-56 border-l shadow-xl p-4 space-y-4 overflow-y-auto"
        style={{
          borderColor:     COLORS.borderColor,
          backgroundColor: COLORS.topbarBg,
          height:          "calc(100vh - 49px)",
        }}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold" style={{ color: COLORS.textPrimary }}>
            Notificaciones
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={13} style={{ color: COLORS.textSecondary }} />
            </button>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
            Por caducar
          </p>
          {productosVencer.map((p) => (
            <NotifItem key={p.nombre} nombre={p.nombre} tiempo={p.tiempo} badge={p.dias}     urgencia={p.urgencia} />
          ))}
        </div>

        <div>
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.textSecondary }}>
            Por agotarse
          </p>
          {productosAgotar.map((p) => (
            <NotifItem key={p.nombre} nombre={p.nombre} tiempo={p.tiempo} badge={p.unidades} urgencia={p.urgencia} />
          ))}
        </div>
      </aside>
    </>
  );
}