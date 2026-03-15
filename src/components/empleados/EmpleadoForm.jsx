import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { COLORS } from "../../constants/colors";

const empty = { nombre: "", apellido: "", telefono: "", cargo: "", salario: "" };

export function EmpleadoForm({ empleado = null, onSave, onCancel }) {
  const isEdit = Boolean(empleado);

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(empleado ? { ...empleado } : empty);
    setErrors({});
  }, [empleado]);

  const handleChange = (field) => (e) => {
    setForm((prev)   => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.nombre.trim())   e.nombre   = "El nombre es obligatorio.";
    if (!form.apellido.trim()) e.apellido = "El apellido es obligatorio.";
    if (!form.telefono.trim()) e.telefono = "El teléfono es obligatorio.";
    if (!form.cargo.trim())    e.cargo    = "El cargo es obligatorio.";
    if (!String(form.salario).trim()) {
      e.salario = "El salario es obligatorio.";
    } else if (isNaN(form.salario) || Number(form.salario) < 0) {
      e.salario = "Ingresa un salario válido.";
    }
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, salario: Number(form.salario) });
  };

  const Field = ({ field, label, placeholder, hint, type = "text" }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={handleChange(field)}
        className={[
          "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors",
          "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
          errors[field] ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
        ].join(" ")}
        style={{ color: COLORS.textPrimary }}
      />
      {errors[field]
        ? <p className="text-xs text-red-500">{errors[field]}</p>
        : <p className="text-xs" style={{ color: COLORS.textSecondary }}>{hint}</p>
      }
    </div>
  );

  return (
    <div
      className="rounded-2xl p-8 border"
      style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}
    >
      <h2 className="text-base font-bold mb-6" style={{ color: COLORS.textPrimary }}>
        {isEdit ? "Editar empleado" : "Agregar nuevo empleado"}
      </h2>

      {/* Fila 1: Nombre + Cargo */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field field="nombre" label="Nombre" placeholder="Nombre"
          hint="Uno o dos nombres para identificación." />
        <Field field="cargo" label="Cargo" placeholder="Mesero"
          hint="Cargo del empleado a ingresar." />
      </div>

      {/* Fila 2: Apellido + Salario */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field field="apellido" label="Apellido" placeholder="Apellido"
          hint="Uno o dos apellidos para identificación." />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Salario</label>
          <div
            className={[
              "flex items-center rounded-lg border bg-white overflow-hidden transition-colors",
              "focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100",
              errors.salario ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
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
              value={form.salario}
              onChange={handleChange("salario")}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
              style={{ color: COLORS.textPrimary }}
            />
          </div>
          {errors.salario
            ? <p className="text-xs text-red-500">{errors.salario}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Salario del empleado.</p>
          }
        </div>
      </div>

      {/* Fila 3: Teléfono (mitad izquierda) */}
      <div className="w-1/2 pr-2.5 mb-8">
        <Field field="telefono" label="Teléfono" placeholder="0000-0000"
          hint="Número de teléfono del empleado." />
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