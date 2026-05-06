import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { COLORS } from "../../constants/colors";

const empty = { nombre: "", descripcion: "" };

export function CategoriaForm({ categoria = null, onSave, onCancel }) {
  const isEdit = Boolean(categoria);

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(categoria ? { ...categoria } : empty);
    setErrors({});
  }, [categoria]);

  const handleChange = (field) => (e) => {
    setForm((prev)   => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    if (!form.nombre.trim())
      e.nombre = "El nombre es obligatorio.";
    else if (!soloLetras.test(form.nombre))
      e.nombre = "El nombre solo debe contener letras.";

    if (!form.descripcion.trim())
      e.descripcion = "La descripción es obligatoria.";
    else if (form.descripcion.trim().length < 10)
      e.descripcion = "La descripción debe tener al menos 10 caracteres.";

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
        {isEdit ? "Editar categoría" : "Agregar nueva categoría"}
      </h2>

      {/* Fila 1: Nombre + Descripción */}
      <div className="grid grid-cols-2 gap-5 mb-8">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Nombre</label>
          <input
            type="text" placeholder="Nombre"
            value={form.nombre} onChange={handleChange("nombre")}
            className={[
              "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors",
              "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
              errors.nombre ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
            style={{ color: COLORS.textPrimary }}
          />
          {errors.nombre
            ? <p className="text-xs text-red-500">{errors.nombre}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Nombre de la categoría.</p>
          }
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Descripción</label>
          <input
            type="text" placeholder="Texto informativo de la nueva categoría."
            value={form.descripcion} onChange={handleChange("descripcion")}
            className={[
              "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors",
              "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
              errors.descripcion ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
            style={{ color: COLORS.textPrimary }}
          />
          {errors.descripcion
            ? <p className="text-xs text-red-500">{errors.descripcion}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Texto informativo de la nueva categoría.</p>
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