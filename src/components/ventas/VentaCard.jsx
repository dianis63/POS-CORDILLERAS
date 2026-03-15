import { Clock, Calendar, Eye } from "lucide-react";
import { COLORS } from "../../constants/colors";

export function VentaCard({ venta, onVer }) {
  const pagado     = venta.estado === "pagado";
  const completado = venta.estado === "completado";

  const badgeConfig = {
    "sin-pagar":  { bg: COLORS.badgeSinPagarBg,  text: COLORS.badgeSinPagarText, label: "Sin pagar"  },
    "pagado":     { bg: COLORS.badgePagadoBg,     text: COLORS.badgePagadoText,   label: "Pagado"     },
    "completado": { bg: "#f3f4f6",                text: COLORS.textSecondary,     label: "Completado" },
  };
  const badge = badgeConfig[venta.estado] ?? badgeConfig["sin-pagar"];

  return (
    <div
      className="rounded-2xl p-5 border flex flex-col gap-3"
      style={{
        backgroundColor: completado ? "#fafafa" : COLORS.ventaCardBg,
        borderColor:     COLORS.borderColor,
        opacity:         completado ? 0.75 : 1,
      }}
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: COLORS.textSecondary }}>Número de orden</p>
        <span
          className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: badge.bg, color: badge.text }}
        >
          {badge.label}
        </span>
      </div>

      <p className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
        N° {venta.id}
      </p>

      {/* Cliente y total */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{venta.cliente}</p>
        <p className="text-sm font-bold"   style={{ color: COLORS.textPrimary }}>
          $ {venta.total.toFixed(2)}
        </p>
      </div>

      {/* Hora y fecha */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Clock    size={13} style={{ color: COLORS.textSecondary }} />
          <span className="text-xs" style={{ color: COLORS.textSecondary }}>{venta.hora}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={13} style={{ color: COLORS.textSecondary }} />
          <span className="text-xs" style={{ color: COLORS.textSecondary }}>{venta.fecha}</span>
        </div>
      </div>

      <div className="border-t pt-3" style={{ borderColor: COLORS.borderColor }}>
        <p className="text-sm" style={{ color: COLORS.textSecondary }}>
          {venta.productos} productos
        </p>
      </div>

      {/* Nota */}
      <div>
        <p className="text-xs mb-1" style={{ color: COLORS.textSecondary }}>Nota:</p>
        <p className="text-xs"      style={{ color: COLORS.textSecondary }}>{venta.nota || "---"}</p>
      </div>

      {/* Botón Ver */}
      <button
        onClick={() => onVer(venta)}
        disabled={completado}
        className="mt-1 w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: COLORS.statCardBg, color: COLORS.accentBlue }}
      >
        <Eye size={14} />
        Ver venta
      </button>
    </div>
  );
}