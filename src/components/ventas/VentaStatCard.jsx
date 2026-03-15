import { COLORS } from "../../constants/colors";

export function VentaStatCard({ label, value, icon: Icon, bg }) {
  return (
    <div
      className="flex-1 rounded-2xl p-5 flex justify-between items-start"
      style={{ backgroundColor: bg, border: `1px solid ${COLORS.borderColor}` }}
    >
      <div>
        <p className="text-sm mb-2" style={{ color: COLORS.textSecondary }}>{label}</p>
        <p className="text-3xl font-bold" style={{ color: COLORS.textPrimary }}>{value}</p>
      </div>
      <Icon size={20} strokeWidth={1.5} style={{ color: COLORS.textSecondary }} />
    </div>
  );
}