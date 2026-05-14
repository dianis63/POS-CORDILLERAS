import {
  LayoutDashboard, FileText, ShoppingCart, TrendingUp,
  Users, Package, Boxes, Tag, UserCircle,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    section: "Dashboard",
    items: [
      { key: "estadisticas", icon: LayoutDashboard, label: "Estadísticas", roles: ["Admin"] },
      { key: "reportes",     icon: FileText,        label: "Reportes",     roles: ["Admin"] },
    ],
  },
  {
    section: "Venta",
    items: [
      { key: "punto-de-venta", icon: ShoppingCart, label: "Punto de venta" },
      { key: "ventas",         icon: TrendingUp,   label: "Ventas"         },
    ],
  },
  {
    section: "Inventario",
    items: [
      { key: "productos",  icon: Package, label: "Productos"  },
      { key: "insumos",    icon: Boxes,   label: "Insumos"    },
      { key: "categorias", icon: Tag,     label: "Categorías" },
    ],
  },
  {
    section: "Personal",
    items: [
      { key: "empleados", icon: UserCircle, label: "Empleados", roles: ["Admin"] },
    ],
  },
];