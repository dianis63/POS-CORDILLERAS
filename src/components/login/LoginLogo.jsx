import logo       from "../../assets/LogoCordilleras1.png";
import { COLORS } from "../../constants/colors";

export function LoginLogo() {
  return (
    <div
      className="w-1/3 flex items-center justify-center"
      style={{ backgroundColor: COLORS.loginLogoBg }}  // ← era logoBg
    >
      <img
        src={logo}
        alt="Cordilleras Specialty Coffee"
        className="w-40 h-40 object-contain"
      />
    </div>
  );
}