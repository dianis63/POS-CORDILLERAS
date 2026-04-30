import { COLORS } from "../../constants/colors";

export function InputField({ id, label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium tracking-wide"
        style={{ color: COLORS.loginLabelColor }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
        style={{
          backgroundColor: COLORS.loginInputBg,
          border: `1px solid ${COLORS.loginInputBorder}`,
          color: COLORS.loginInputText,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = COLORS.loginInputBorderFocus;
          e.target.style.boxShadow = `0 0 0 3px ${COLORS.loginInputRing}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = COLORS.loginInputBorder;
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}