import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { CATEGORIAS } from "../../data/mockData";

const empty = { nombre: "", tamanio: "", categoria: "", precioUnitario: "", estado: true };

export function ProductoForm({ producto = null, onSave, onCancel }) {
  const isEdit = Boolean(producto);

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(producto ? { ...producto } : empty);
    setErrors({});
  }, [producto]);

  const handleChange = (field) => (e) => {
    setForm((prev)   => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())  e.nombre        = "El nombre es obligatorio.";
    if (!form.tamanio.trim()) e.tamanio        = "El tamaño es obligatorio.";
    if (!form.categoria)      e.categoria      = "La categoría es obligatoria.";
    if (!String(form.precioUnitario).trim()) {
      e.precioUnitario = "El precio es obligatorio.";
    } else if (isNaN(form.precioUnitario) || Number(form.precioUnitario) < 0) {
      e.precioUnitario = "Ingresa un precio válido.";
    }
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, precioUnitario: Number(form.precioUnitario) });
  };

  return (
    <div
      className="rounded-2xl p-8 border"
      style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}
    >
      <h2 className="text-base font-bold mb-6" style={{ color: COLORS.textPrimary }}>
        {isEdit ? "Editar producto" : "Agregar nuevo producto"}
      </h2>

      {/* Fila 1: Nombre + Tamaño */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Nombre</label>
          <input
            type="text" placeholder="Nombre" value={form.nombre}
            onChange={handleChange("nombre")}
            className={[
              "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors",
              "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
              errors.nombre ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
            style={{ color: COLORS.textPrimary }}
          />
          {errors.nombre
            ? <p className="text-xs text-red-500">{errors.nombre}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Nombre del producto a ingresar.</p>
          }
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Tamaño</label>
          <input
            type="text" placeholder="16 oz" value={form.tamanio}
            onChange={handleChange("tamanio")}
            className={[
              "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors",
              "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
              errors.tamanio ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
            style={{ color: COLORS.textPrimary }}
          />
          {errors.tamanio
            ? <p className="text-xs text-red-500">{errors.tamanio}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Tamaño del producto a vender.</p>
          }
        </div>
      </div>

      {/* Fila 2: Categoría + Estado */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Categoría</label>
          <select
            value={form.categoria}
            onChange={handleChange("categoria")}
            className={[
              "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors appearance-none cursor-pointer",
              "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
              errors.categoria ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
            style={{ color: form.categoria ? COLORS.textPrimary : COLORS.textSecondary }}
          >
            <option value="" disabled>Bebidas frías...</option>
            {CATEGORIAS.map((op) => <option key={op} value={op}>{op}</option>)}
          </select>
          {errors.categoria
            ? <p className="text-xs text-red-500">{errors.categoria}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Categoría a la que pertenece el producto.</p>
          }
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Estado</label>
          <div className="flex items-center gap-2 py-2.5">
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, estado: !prev.estado }))}
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none"
              style={{ backgroundColor: form.estado ? COLORS.accentBlue : "#d1d5db" }}
            >
              <span
                className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                style={{ transform: form.estado ? "translateX(18px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Fila 3: Precio */}
      <div className="w-1/2 pr-2.5 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Precio</label>
          <div
            className={[
              "flex items-center rounded-lg border bg-white overflow-hidden transition-colors",
              "focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100",
              errors.precioUnitario ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
          >
            <span
              className="px-3 py-2.5 text-sm border-r select-none"
              style={{ color: COLORS.textSecondary, borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
            >
              $
            </span>
            <input
              type="number" step="0.01" min="0" placeholder="00.00"
              value={form.precioUnitario}
              onChange={handleChange("precioUnitario")}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
              style={{ color: COLORS.textPrimary }}
            />
          </div>
          {errors.precioUnitario
            ? <p className="text-xs text-red-500">{errors.precioUnitario}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Precio de venta por unidad.</p>
          }
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: COLORS.accentBlue }}
        >
          <CheckCircle size={16} />
          Aceptar
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          style={{ color: COLORS.textSecondary, backgroundColor: "#f3f4f6" }}
        >
          <XCircle size={16} />
          Cancelar
        </button>
      </div>
    </div>
  );
}