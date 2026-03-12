import { useState, useEffect }      from "react";
import { CheckCircle, XCircle }     from "lucide-react";
import { COLORS }                   from "../../constants/colors";

const empty = { nombre: "", apellido: "", correo: "" };

function Field({ id, label, placeholder, hint, type = "text", value, onChange, error }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={[
          "w-full rounded-lg border px-3 py-2.5 text-sm bg-white",
          "outline-none transition-colors",
          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
          error
            ? "border-red-400 ring-2 ring-red-100"
            : "border-gray-200 hover:border-gray-300",
        ].join(" ")}
        style={{ color: COLORS.textPrimary }}
      />
      {error
        ? <p className="text-xs text-red-500">{error}</p>
        : <p className="text-xs" style={{ color: COLORS.textSecondary }}>{hint}</p>
      }
    </div>
  );
}

export function ClienteForm({ cliente = null, onSave, onCancel }) {
  const isEdit = Boolean(cliente);

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(cliente ? { ...cliente } : empty);
    setErrors({});
  }, [cliente]);

  const handleChange = (field) => (e) => {
    setForm((prev)   => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

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

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div
      className="rounded-2xl p-8 border"
      style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}
    >
      <h2 className="text-base font-bold mb-6" style={{ color: COLORS.textPrimary }}>
        {isEdit ? "Editar cliente" : "Agregar nuevo cliente"}
      </h2>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field
          id="nombre" label="Nombre" placeholder="Nombre"
          hint="Uno o dos nombres para identificación."
          value={form.nombre} onChange={handleChange("nombre")} error={errors.nombre}
        />
        <Field
          id="correo" label="Correo electrónico" placeholder="ejemplo@gmail.com"
          hint="Correo electrónico activo." type="email"
          value={form.correo} onChange={handleChange("correo")} error={errors.correo}
        />
      </div>

      <div className="w-1/2 pr-2.5 mb-8">
        <Field
          id="apellido" label="Apellido" placeholder="Apellido"
          hint="Uno o dos apellidos para identificación."
          value={form.apellido} onChange={handleChange("apellido")} error={errors.apellido}
        />
      </div>

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