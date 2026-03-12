import { COLORS } from "../../constants/colors";

export function PrimaryButton({ onClick, loading = false, label, loadingLabel = "Cargando..." }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ backgroundColor: COLORS.loginBtnBg, color: COLORS.loginBtnText }}
      onMouseEnter={(e) => {
        if (!loading) e.currentTarget.style.backgroundColor = COLORS.loginBtnHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = COLORS.loginBtnBg;
      }}
    >
      {loading ? loadingLabel : label}
    </button>
  );
}