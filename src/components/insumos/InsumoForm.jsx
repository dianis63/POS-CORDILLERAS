import { useState, useEffect } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { COLORS } from "../../constants/colors";

const MEDIDAS = ["kg", "gr", "litros", "ml", "unidades"];

const empty = {
  nombre: "", medida: "kg", stockMinimo: "", stockActual: "",
  precioCompra: "", vencimiento: "", ultimaCompra: "",
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

export function InsumoForm({ insumo = null, onSave, onCancel }) {
  const isEdit = Boolean(insumo);

  const [form,   setForm]   = useState(empty);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(insumo ? { ...insumo } : empty);
    setErrors({});
  }, [insumo]);

  const handleChange = (field) => (e) => {
    setForm((prev)   => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    const soloLetrasNum = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-/.]+$/;

    if (!form.nombre.trim())
      e.nombre = "El nombre es obligatorio.";
    else if (!soloLetrasNum.test(form.nombre))
      e.nombre = "El nombre contiene caracteres inválidos.";

    if (!form.medida)
      e.medida = "La medida es obligatoria.";

    if (String(form.stockMinimo).trim() === "")
      e.stockMinimo = "El stock mínimo es obligatorio.";
    else if (isNaN(form.stockMinimo) || Number(form.stockMinimo) < 0)
      e.stockMinimo = "Ingresa un valor válido.";

    if (String(form.stockActual).trim() === "")
      e.stockActual = "El stock actual es obligatorio.";
    else if (isNaN(form.stockActual) || Number(form.stockActual) < 0)
      e.stockActual = "Ingresa un valor válido.";

    if (String(form.precioCompra).trim() === "")
      e.precioCompra = "El precio es obligatorio.";
    else if (isNaN(form.precioCompra) || Number(form.precioCompra) < 0)
      e.precioCompra = "Ingresa un precio válido.";

    if (!form.vencimiento)
      e.vencimiento = "El vencimiento es obligatorio.";

    if (!form.ultimaCompra)
      e.ultimaCompra = "La última compra es obligatoria.";
    else if (form.vencimiento && form.ultimaCompra > form.vencimiento)
      e.ultimaCompra = "La última compra no puede ser después del vencimiento.";

    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      ...form,
      stockMinimo:  Number(form.stockMinimo),
      stockActual:  Number(form.stockActual),
      precioCompra: Number(form.precioCompra),
    });
  };

  return (
    <div className="rounded-2xl p-8 border"
      style={{ backgroundColor: COLORS.cardBg, borderColor: COLORS.borderColor }}>
      <h2 className="text-base font-bold mb-6" style={{ color: COLORS.textPrimary }}>
        {isEdit ? "Editar insumo" : "Agregar nuevo insumo"}
      </h2>

      {/* Fila 1: Nombre + Precio */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field field="nombre" label="Nombre" placeholder="Café en grano"
          hint="Nombre del insumo." form={form} errors={errors} onChange={handleChange} />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Precio de compra</label>
          <div className={[
            "flex items-center rounded-lg border bg-white overflow-hidden transition-colors",
            "focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100",
            errors.precioCompra ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
          ].join(" ")}>
            <span className="px-3 py-2.5 text-sm border-r select-none"
              style={{ color: COLORS.textSecondary, borderColor: "#e5e7eb", backgroundColor: "#f9fafb" }}>
              $
            </span>
            <input type="number" step="0.01" min="0" placeholder="00.00"
              value={form.precioCompra} onChange={handleChange("precioCompra")}
              className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
              style={{ color: COLORS.textPrimary }} />
          </div>
          {errors.precioCompra
            ? <p className="text-xs text-red-500">{errors.precioCompra}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Precio por unidad de medida.</p>
          }
        </div>
      </div>

      {/* Fila 2: Medida (select) + Vencimiento */}
      <div className="grid grid-cols-2 gap-5 mb-5">

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>Medida</label>
          <select
            value={form.medida}
            onChange={handleChange("medida")}
            className={[
              "w-full rounded-lg border px-3 py-2.5 text-sm bg-white outline-none transition-colors",
              "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
              errors.medida ? "border-red-400 ring-2 ring-red-100" : "border-gray-200 hover:border-gray-300",
            ].join(" ")}
            style={{ color: COLORS.textPrimary }}
          >
            {MEDIDAS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.medida
            ? <p className="text-xs text-red-500">{errors.medida}</p>
            : <p className="text-xs" style={{ color: COLORS.textSecondary }}>Unidad de medida del insumo.</p>
          }
        </div>

        <Field field="vencimiento" label="Vencimiento" placeholder=""
          hint="Fecha de vencimiento para notificar." type="date"
          form={form} errors={errors} onChange={handleChange} />
      </div>

      {/* Fila 3: Stock mínimo + Última compra */}
      <div className="grid grid-cols-2 gap-5 mb-5">
        <Field field="stockMinimo" label="Stock mínimo" placeholder="0"
          hint="Cantidad mínima antes de notificar." type="number"
          form={form} errors={errors} onChange={handleChange} />
        <Field field="ultimaCompra" label="Última compra" placeholder=""
          hint="Fecha de la última compra del insumo." type="date"
          form={form} errors={errors} onChange={handleChange} />
      </div>

      {/* Fila 4: Stock actual */}
      <div className="w-1/2 pr-2.5 mb-8">
        <Field field="stockActual" label="Stock actual" placeholder="0"
          hint="Cantidad actual disponible." type="number"
          form={form} errors={errors} onChange={handleChange} />
      </div>

      {/* Botones */}
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