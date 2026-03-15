import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";
import { CATEGORIAS } from "../data/mockData";

const COLORS = {
  textPrimary:   "#000000",
  textSecondary: "#6b7280",
  accentBlue:    "#7181F8",
};

export default function ProductoModal({ open, onClose, onSave, producto = null }) {
  const isEdit = Boolean(producto);
  const empty  = { nombre: "", tamanio: "", categoria: "", precioUnitario: "", estado: true };

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(producto ? { ...producto } : empty);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, producto]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())  e.nombre     = "El nombre es obligatorio.";
    if (!form.tamanio.trim()) e.tamanio    = "El tamaño es obligatorio.";
    if (!form.categoria)      e.categoria  = "La categoría es obligatoria.";
    if (!String(form.precioUnitario).trim()) {
      e.precioUnitario = "El precio es obligatorio.";
    } else if (isNaN(form.precioUnitario) || Number(form.precioUnitario) < 0) {
      e.precioUnitario = "Ingresa un precio válido.";
    }
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, precioUnitario: Number(form.precioUnitario) });
    onClose();
  };

  const Field = ({ id, label, placeholder, hint, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[id]}
        onChange={handleChange(id)}
        className={[
          "w-full rounded-lg border px-3 py-2.5 text-sm bg-white",
          "outline-none transition-colors",
          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
          errors[id]
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200 hover:border-gray-300",
        ].join(" ")}
        style={{ color: COLORS.textPrimary }}
      />
      {errors[id]
        ? <p className="text-xs text-red-500">{errors[id]}</p>
        : <p className="text-xs" style={{ color: COLORS.textSecondary }}>{hint}</p>
      }
    </div>
  );

  const SelectField = ({ id, label, hint }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
        {label}
      </label>
      <select
        value={form[id]}
        onChange={handleChange(id)}
        className={[
          "w-full rounded-lg border px-3 py-2.5 text-sm bg-white",
          "outline-none transition-colors appearance-none cursor-pointer",
          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
          errors[id]
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200 hover:border-gray-300",
        ].join(" ")}
        style={{ color: form[id] ? COLORS.textPrimary : COLORS.textSecondary }}
      >
        <option value="" disabled>Selecciona una categoría...</option>
        {CATEGORIAS.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
      {errors[id]
        ? <p className="text-xs text-red-500">{errors[id]}</p>
        : <p className="text-xs" style={{ color: COLORS.textSecondary }}>{hint}</p>
      }
    </div>
  );

  const PrecioField = ({ id, label, hint }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
        {label}
      </label>
      <div
        className={[
          "flex items-center rounded-lg border bg-white overflow-hidden transition-colors",
          "focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100",
          errors[id]
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200 hover:border-gray-300",
        ].join(" ")}
      >
        <span
          className="px-3 py-2.5 text-sm border-r select-none"
          style={{ color: COLORS.textSecondary, borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}
        >
          $
        </span>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="00.00"
          value={form[id]}
          onChange={handleChange(id)}
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
          style={{ color: COLORS.textPrimary }}
        />
      </div>
      {errors[id]
        ? <p className="text-xs text-red-500">{errors[id]}</p>
        : <p className="text-xs" style={{ color: COLORS.textSecondary }}>{hint}</p>
      }
    </div>
  );

  const ToggleField = ({ label }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
        {label}
      </label>
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
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.30)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl p-10 shadow-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={16} style={{ color: COLORS.textSecondary }} />
        </button>

        <h2 className="text-lg font-bold mb-7" style={{ color: COLORS.textPrimary }}>
          {isEdit ? "Editar producto" : "Agregar nuevo producto"}
        </h2>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <Field id="nombre"  label="Nombre"  placeholder="Nombre"
            hint="Nombre del producto a ingresar." />
          <Field id="tamanio" label="Tamaño"  placeholder="16 oz"
            hint="Tamaño del producto a vender." />
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <SelectField id="categoria" label="Categoría"
            hint="Categoría a la que pertenece el producto." />
          <ToggleField label="Estado" />
        </div>

        <div className="w-1/2 pr-2.5 mb-9">
          <PrecioField id="precioUnitario" label="Precio"
            hint="Precio de venta por unidad." />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.accentBlue }}
          >
            <CheckCircle size={16} />
            Aceptar
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            style={{ color: COLORS.textSecondary, backgroundColor: "#f3f4f6" }}
          >
            <XCircle size={16} />
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}