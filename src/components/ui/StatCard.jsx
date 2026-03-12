import { COLORS } from "../../constants/colors";

export function StatCard({ icon: Icon, label, value, bg }) {
  return (
    <div
      className="flex-1 rounded-2xl p-5 flex justify-between items-start min-w-0"
      style={{ backgroundColor: bg }}
    >
      <div>
        <p className="text-sm mb-1"      style={{ color: COLORS.textSecondary }}>{label}</p>
        <p className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>{value}</p>
      </div>
      <Icon size={22} strokeWidth={1.5} style={{ color: COLORS.accentBlue }} />
    </div>
  );
}