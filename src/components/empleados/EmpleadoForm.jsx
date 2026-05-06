import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { COLORS } from "../../constants/colors";

const empty = {
  nombre: "", apellido: "", telefono: "",
  cargo: "", salario: "",
  usuario: "", contrasena: "", tipoUsuario: "Empleado",
};

// ← FUERA del componente
function Field({ field, label, placeholder, hint, type = "text", form, errors, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[field]}
        onChange={onChange(field)}
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
}

export function EmpleadoForm({ empleado = null, onSave, onCancel }) {
  const isEdit = Boolean(empleado);
  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(empleado ? { ...empleado, contrasena: "", usuario: empleado.usuario || "" } : empty);
    setErrors({});
  }, [empleado]);

  const handleChange = (field) => (e) => {
    setForm((prev)   => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };
    const formatTelefono = (val) => {
      const nums = val.replace(/\D/g, "").slice(0, 8);
      if (nums.length <= 4) return nums;
      return `${nums.slice(0, 4)}-${nums.slice(4)}`;
    };
  const validate = () => {
    
    const e = {};
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!form.nombre.trim())        e.nombre   = "El nombre es obligatorio.";
    else if (!soloLetras.test(form.nombre)) e.nombre = "Solo se permiten letras.";

    if (!form.apellido.trim())      e.apellido = "El apellido es obligatorio.";
    else if (!soloLetras.test(form.apellido)) e.apellido = "Solo se permiten letras.";
    const telefonoRegex = /^\d{4}-\d{4}$/;
    if (!form.telefono.trim())           e.telefono = "El teléfono es obligatorio.";
    else if (!telefonoRegex.test(form.telefono)) e.telefono = "Formato inválido. Ej: 7255-7298";
    if (!form.cargo.trim())    e.cargo    = "El cargo es obligatorio.";
    if (!String(form.salario).trim()) {
      e.salario = "El salario es obligatorio.";
    } else if (isNaN(form.salario) || Number(form.salario) < 0) {
      e.salario = "Ingresa un salario válido.";
    }
    if (!form.usuario.trim()) e.usuario = "El usuario es obligatorio.";
    if (!isEdit && !form.contrasena.trim()) {
      e.contrasena = "La contraseña es obligatoria.";
    } else if (!isEdit && form.contrasena.length < 6) {
      e.contrasena = "Mínimo 6 caracteres.";
    }
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, salario: Number(form.salario) });
  };

  return (
    <div className="rounded-2xl p-8 border" style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}>
      <h2 className="text-base font-bold mb-6" style={{ color: COLORS.textPrimary }}>
        {isEdit ? "Editar empleado" : "Agregar nuevo empleado"}
      </h2>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field field="nombre"   label="Nombre"   placeholder="Nombre"   hint="Nombre del empleado."   form={form} errors={errors} onChange={handleChange} />
        <Field field="cargo"    label="Cargo"    placeholder="Mesero"   hint="Cargo del empleado."    form={form} errors={errors} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field field="apellido" label="Apellido" placeholder="Apellido" hint="Apellido del empleado."  form={form} errors={errors} onChange={handleChange} />

        {/* Salario con prefijo $ */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Salario</label>
          <div className={[
            "flex items-center rounded-lg border bg-white overflow-hidden transition-colors",
            "focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100",
            errors.salario ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
          ].join(" ")}>
            <span className="px-3 py-2.5 text-sm border-r select-none"
              style={{ color: COLORS.textSecondary, borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}>
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

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Teléfono</label>
        <input
          type="text"
          placeholder="0000-0000"
          value={form.telefono}
          onChange={(e) => {
            const formatted = formatTelefono(e.target.value);
            setForm((prev) => ({ ...prev, telefono: formatted }));
            setErrors((prev) => ({ ...prev, telefono: undefined }));
          }}
          maxLength={9}
          className={[
            "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors",
            "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
            errors.telefono ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
          ].join(" ")}
          style={{ color: COLORS.textPrimary }}
        />
        {errors.telefono
          ? <p className="text-xs text-red-500">{errors.telefono}</p>
          : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Formato: 0000-0000</p>
        }
      </div>

      <div className="border-t mb-5" style={{ borderColor: COLORS.borderColor }} />
      <p className="text-sm font-semibold mb-4" style={{ color: COLORS.textPrimary }}>Credenciales del sistema</p>

      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field field="usuario" label="Usuario" placeholder="nombre.apellido" hint="Usuario para iniciar sesión." form={form} errors={errors} onChange={handleChange} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Tipo de usuario</label>
          <select
            value={form.tipoUsuario}
            onChange={handleChange("tipoUsuario")}
            className="w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors border-gray-200 hover:border-gray-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            style={{ color: COLORS.textPrimary }}
          >
            <option value="Empleado">Empleado</option>
            <option value="Admin">Admin</option>
          </select>
          <p className="text-xs" style={{ color: COLORS.textSecondary }}>Nivel de acceso al sistema.</p>
        </div>
      </div>

      <div className="w-1/2 pr-2.5 mb-8">
        <Field
          field="contrasena"
          label={isEdit ? "Nueva contraseña (opcional)" : "Contraseña"}
          placeholder="••••••••"
          hint={isEdit ? "Déjala vacía para no cambiarla." : "Mínimo 6 caracteres."}
          type="password"
          form={form} errors={errors} onChange={handleChange}
        />
      </div>

      <div className="flex gap-3">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: COLORS.accentBlue }}>
          <CheckCircle size={16} /> Aceptar
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          style={{ color: COLORS.textSecondary, backgroundColor: "#f3f4f6" }}>
          <XCircle size={16} /> Cancelar
        </button>
      </div>
    </div>
  );
}