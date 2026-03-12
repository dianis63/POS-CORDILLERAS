import { useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const COLORS = {
  textPrimary:   "#000000",
  textSecondary: "#6b7280",
  accentBlue:    "#7181F8",
};

export default function ClienteModal({ open, onClose, onSave, cliente = null }) {
  const isEdit = Boolean(cliente);
  const empty  = { nombre: "", apellido: "", correo: "" };

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(cliente ? { ...cliente } : empty);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cliente]);

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())   e.nombre   = "El nombre es obligatorio.";
    if (!form.apellido.trim()) e.apellido  = "El apellido es obligatorio.";
    if (!form.correo.trim()) {
      e.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) {
      e.correo = "Ingresa un correo válido.";
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
    onSave(form);
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
          {isEdit ? "Editar cliente" : "Agregar nuevo cliente"}
        </h2>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <Field id="nombre" label="Nombre" placeholder="Nombre"
            hint="Uno o dos nombres para identificación." />
          <Field id="correo" label="Correo electrónico" placeholder="ejemplo@gmail.com"
            hint="Correo electrónico activo." type="email" />
        </div>

        <div className="w-1/2 pr-2.5 mb-9">
          <Field id="apellido" label="Apellido" placeholder="Apellido"
            hint="Uno o dos apellidos para identificación." />
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