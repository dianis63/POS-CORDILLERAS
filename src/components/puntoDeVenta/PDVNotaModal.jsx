import { useState, useEffect } from "react";
import { X, NotebookPen } from "lucide-react";
import { COLORS } from "../../constants/colors";

export function PDVNotaModal({ open, nota, onClose, onGuardar }) {
  const [valor, setValor] = useState(nota || "");

  useEffect(() => { setValor(nota || ""); }, [nota]);

  if (!open) return null;

  const handleChange = (e) => {
    const val = e.target.value;
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9 .,\-#/'()!?:;\n$]*$/.test(val)) {
      setValor(val);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{ backgroundColor: "#ffffff" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={15} style={{ color: COLORS.textSecondary }} />
        </button>

        <div className="flex items-center gap-2 mb-5">
          <NotebookPen size={18} style={{ color: COLORS.accentBlue }} />
          <h2 className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
            Nota del pedido
          </h2>
        </div>

        <textarea
          autoFocus
          rows={5}
          placeholder="Ej: Sin azúcar, leche de avena, alergia a la canela..."
          value={valor}
          onChange={handleChange}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none resize-none transition-colors"
          style={{
            borderColor:     COLORS.borderColor,
            backgroundColor: COLORS.cardBg,
            color:           COLORS.textPrimary,
          }}
          onFocus={(e) => (e.target.style.borderColor = COLORS.accentBlue)}
          onBlur={(e)  => (e.target.style.borderColor = COLORS.borderColor)}
        />
        <p className="text-xs mt-1.5" style={{ color: COLORS.textSecondary }}>
          Esta nota aplica para todo el pedido actual.
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => onGuardar(valor)}
            className="px-6 py-2 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.accentBlue }}
          >
            Guardar nota
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            style={{ color: COLORS.textSecondary, backgroundColor: "#f3f4f6" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}