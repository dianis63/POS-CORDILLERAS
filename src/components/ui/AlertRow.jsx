import { AlertTriangle } from "lucide-react";
import { COLORS } from "../../constants/colors";

const BG_MAP   = { red: "#fee2e2", orange: "#ffedd5", gray: "#f3f4f6" };
const TEXT_MAP = { red: "#dc2626", orange: "#ea580c", gray: "#6b7280" };

export function AlertRow({ nombre, tiempo, badge, urgencia }) {
  return (
    <div
      className="flex items-center justify-between py-2 border-b last:border-0"
      style={{ borderColor: COLORS.borderColor }}
    >
      <div className="flex items-center gap-2">
        <AlertTriangle size={16} style={{ color: TEXT_MAP[urgencia] }} />
        <div>
          <p className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{nombre}</p>
          <p className="text-xs"             style={{ color: COLORS.textSecondary }}>{tiempo}</p>
        </div>
      </div>
      {badge && (
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: BG_MAP[urgencia],
            color:           TEXT_MAP[urgencia],
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}