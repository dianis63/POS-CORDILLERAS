import logo from "../../assets/LogoCordilleras.png";
import { LogOut } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { NAV_ITEMS } from "../../constants/navigation";


function NavSection({ label, children, sidebarOpen }) {
  return (
    <div className="mb-2">
      {sidebarOpen && (
        <p
          className="text-xs font-semibold uppercase tracking-widest px-4 py-2"
          style={{ color: COLORS.sidebarText }}
        >
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, sidebarOpen, onClick }) {
  return (
    <div
      className="flex items-center gap-3 py-2.5 mx-2 rounded-lg cursor-pointer transition-all duration-150"
      onClick={onClick}
      style={{
        backgroundColor: active ? COLORS.sidebarActiveBg : "transparent",
        color:           active ? COLORS.sidebarActiveText : COLORS.sidebarText,
        fontWeight:      active ? 600 : 400,
        paddingLeft:     sidebarOpen ? "1rem" : "0",
        paddingRight:    sidebarOpen ? "1rem" : "0",
        justifyContent:  sidebarOpen ? "flex-start" : "center",
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = COLORS.sidebarHoverBg;
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = "transparent";
      }}
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} style={{ flexShrink: 0 }} />
      {sidebarOpen && <span className="text-sm">{label}</span>}
    </div>
  );
}

// Items que solo los admin pueden ver
const SOLO_ADMIN = ["estadisticas", "reportes"];

// ─────────────────────────────────────────────
//  SIDEBAR
// ─────────────────────────────────────────────
export function Sidebar({ currentPage, onNavigate, onLogout, sidebarOpen, setSidebarOpen, usuario }) {
  console.log("Sidebar usuario:", usuario);
  const esAdmin = usuario?.tipo?.toLowerCase() === "admin";

  return (
    <aside
      className="flex-shrink-0 flex flex-col border-r h-full overflow-y-auto transition-all duration-300"
      style={{
        width:           sidebarOpen ? "13rem" : "3.5rem",
        backgroundColor: COLORS.sidebar,
        borderColor:     COLORS.borderColor,
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 border-b overflow-hidden"
        style={{
          borderColor:    COLORS.borderColor,
          justifyContent: sidebarOpen ? "flex-start" : "center",
          padding:        "0.75rem",
          height:         "49px",
        }}
      >
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0">
          <img src={logo} alt="Cordilleras" className="w-60 h-60 object-contain" />
        </div>
        {sidebarOpen && (
          <span
            className="font-semibold text-sm whitespace-nowrap"
            style={{ color: COLORS.textPrimary }}
          >
            Cordilleras
          </span>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 py-3">
        {NAV_ITEMS.map(({ section, items }) => {
          const itemsFiltrados = items.filter(
            ({ key }) => esAdmin || !SOLO_ADMIN.includes(key)
          );

          if (itemsFiltrados.length === 0) return null;

          return (
            <NavSection key={section} label={section} sidebarOpen={sidebarOpen}>
              {itemsFiltrados.map(({ key, icon, label }) => (
                <NavItem
                  key={key}
                  icon={icon}
                  label={label}
                  active={currentPage === key}
                  sidebarOpen={sidebarOpen}
                  onClick={() => onNavigate(key)}
                />
              ))}
            </NavSection>
          );
        })}
      </div>

      {/* Logout */}
      <div className="border-t p-3" style={{ borderColor: COLORS.borderColor }}>
        <NavItem
          icon={LogOut}
          label="Cerrar sesión"
          sidebarOpen={sidebarOpen}
          onClick={onLogout}
        />
      </div>
    </aside>
  );
}