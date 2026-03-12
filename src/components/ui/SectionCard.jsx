import { COLORS } from "../../constants/colors";

export function SectionCard({ title, legend, children, className = "" }) {
  return (
    <div
      className={`rounded-2xl p-5 ${className}`}
      style={{ backgroundColor: COLORS.cardBg }}
    >
      <div className="flex items-center gap-3 mb-4">
        <p className="text-sm font-semibold" style={{ color: COLORS.textPrimary }}>
          {title}
        </p>
        {legend && (
          <span
            className="flex items-center gap-1 text-xs"
            style={{ color: COLORS.textSecondary }}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-blue-300" />
            {legend}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}