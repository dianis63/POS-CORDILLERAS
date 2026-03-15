import { Trash2, Minus, Plus, XCircle, CheckCircle, ShoppingCart, NotebookPen } from "lucide-react";
import { COLORS } from "../../constants/colors";

const DESCUENTO = 0.10;

export function PDVTicket({ items, cliente, onClienteChange, onCambiarCantidad, onEliminar, onCancelar, onGuardar, onPagar, onNota }) {
  const subtotal  = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const descuento = subtotal * DESCUENTO;
  const total     = subtotal - descuento;

  return (
    <div className="w-96 flex-shrink-0 flex flex-col gap-3">

      {/* Botones superiores */}
      <div className="flex gap-2">
        <button
          onClick={onNota}
          className="p-2 rounded-xl border transition-colors hover:bg-gray-50"
          title="Agregar nota al pedido"
          style={{ borderColor: COLORS.borderColor }}
        >
          <NotebookPen size={16} style={{ color: COLORS.textSecondary }} />
        </button>
        <button
          onClick={onCancelar}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-red-50"
          style={{ borderColor: "#fca5a5", color: COLORS.accentRed, backgroundColor: COLORS.accentRedLight }}
        >
          <XCircle size={15} />
          Cancelar venta
        </button>
        <button
          onClick={onGuardar}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-medium border transition-colors hover:opacity-90"
          style={{ borderColor: "#86efac", color: "#16a34a", backgroundColor: "#dcfce7" }}
        >
          <CheckCircle size={15} />
          Guardar venta
        </button>
      </div>

      {/* Panel cliente + items */}
      <div
        className="flex-1 rounded-2xl border overflow-hidden"
        style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.pdvCardBg }}
      >
        {/* Cliente */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: COLORS.borderColor }}
        >
          <div className="flex-1">
            <p className="text-xs mb-1" style={{ color: COLORS.textSecondary }}>Cliente</p>
            <input
              type="text"
              placeholder="Nombre o mesa"
              value={cliente ?? ""}
              onChange={(e) => onClienteChange(e.target.value)}
              className="text-base font-bold bg-transparent outline-none border-b transition-colors w-full"
              style={{
                color:       COLORS.textPrimary,
                borderColor: COLORS.borderColor,
              }}
              onFocus={(e)  => (e.target.style.borderColor = COLORS.accentBlue)}
              onBlur={(e)   => (e.target.style.borderColor = COLORS.borderColor)}
            />
            <div className="flex items-center gap-4 mt-1.5">
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>--:-- --</span>
              <span className="text-xs" style={{ color: COLORS.textSecondary }}>
                {new Date().toLocaleDateString("es-SV", { month: "long", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </div>

        {/* Encabezado tabla */}
        <div
          className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] px-5 py-2 text-xs font-semibold"
          style={{ color: COLORS.textSecondary, backgroundColor: COLORS.cardBg }}
        >
          <span>Cantidad</span>
          <span>Producto</span>
          <span>C/u</span>
          <span>Subtotal</span>
          <span />
        </div>

        {/* Items */}
        <div className="overflow-y-auto" style={{ maxHeight: "260px" }}>
          {items.length === 0 ? (
            <p className="text-center text-sm py-8" style={{ color: COLORS.textSecondary }}>
              Agrega productos al ticket.
            </p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-[1.2fr_2fr_1fr_1fr_auto] items-center px-5 py-3 border-b last:border-0"
                style={{ borderColor: COLORS.borderColor }}
              >
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onCambiarCantidad(item.id, -1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center border hover:bg-gray-100"
                    style={{ borderColor: COLORS.borderColor }}
                  >
                    <Minus size={11} />
                  </button>
                  <span className="w-5 text-center text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                    {item.cantidad}
                  </span>
                  <button
                    onClick={() => onCambiarCantidad(item.id, 1)}
                    className="w-6 h-6 rounded-lg flex items-center justify-center border hover:bg-gray-100"
                    style={{ borderColor: COLORS.borderColor }}
                  >
                    <Plus size={11} />
                  </button>
                </div>
                <span className="text-sm" style={{ color: COLORS.textPrimary }}>{item.nombre}</span>
                <span className="text-sm" style={{ color: COLORS.textSecondary }}>$ {item.precio.toFixed(2)}</span>
                <span className="text-sm font-medium" style={{ color: COLORS.textPrimary }}>
                  $ {(item.precio * item.cantidad).toFixed(2)}
                </span>
                <button onClick={() => onEliminar(item.id)} className="ml-2 hover:opacity-70 transition-opacity">
                  <Trash2 size={14} style={{ color: COLORS.textSecondary }} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Total */}
      <div
        className="rounded-2xl border px-5 py-4"
        style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.pdvTotalBg }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs mb-0.5" style={{ color: COLORS.textSecondary }}>Total</p>
            <p className="text-2xl font-bold" style={{ color: COLORS.textPrimary }}>
              $ {total.toFixed(2)}
            </p>
            <p className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>
              Subtotal: <span style={{ color: COLORS.textPrimary }}>$ {subtotal.toFixed(2)}</span>
            </p>
            <p className="text-xs" style={{ color: COLORS.textSecondary }}>
              Descuento: <span style={{ color: COLORS.accentRed }}>$ {descuento.toFixed(2)}</span>
            </p>
          </div>
          <button
            onClick={onPagar}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: COLORS.accentBlue }}
          >
            <ShoppingCart size={15} />
            Completar pago
          </button>
        </div>
      </div>

    </div>
  );
}