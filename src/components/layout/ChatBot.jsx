import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { COLORS } from "../../constants/colors";
import { enviarMensaje } from "../../api/chatbotApi";

const OPCIONES_ADMIN = [
    { label: "🧾 Mis ventas hoy",          msg: "mis ventas"              },
    { label: "📊 Mi resumen del mes",       msg: "mi resumen del mes"      },
    { label: "🕐 Última venta",             msg: "última venta"            },
    { label: "🕐 Órdenes pendientes",       msg: "pendientes"              },
    { label: "📊 Ventas totales hoy",       msg: "ventas hoy"              },
    { label: "📅 Hoy vs ayer",              msg: "comparar hoy vs ayer"    },
    { label: "🗓️ Mejor día semana",         msg: "mejor día de la semana"  },
    { label: "🥇 Producto más vendido",     msg: "producto más vendido"    },
    { label: "📦 Categoría más vendida",    msg: "categoría más vendida"   },
    { label: "🏆 Ranking empleados",        msg: "ranking empleados"       },
    { label: "💸 Ticket promedio",          msg: "ticket promedio"         },
    { label: "🔢 Productos activos",        msg: "total de productos"      },
    { label: "📦 Insumos sin stock",        msg: "insumos sin stock"       },
    { label: "⚠️ Insumos por vencer",       msg: "insumos por vencer"      },
    { label: "💰 Ingresos del mes",         msg: "ingresos del mes"        },
    { label: "❓ Ayuda",                    msg: "ayuda"                   },
];

const OPCIONES_EMPLEADO = [
    { label: "🧾 Mis ventas hoy",       msg: "mis ventas"          },
    { label: "📊 Mi resumen del mes",   msg: "mi resumen del mes"  },
    { label: "🕐 Última venta",         msg: "última venta"        },
    { label: "🕐 Órdenes pendientes",   msg: "pendientes"          },
    { label: "🔍 Buscar producto",      msg: "buscar producto"     },
    { label: "❓ Ayuda",                msg: "ayuda"               },
];

function MessageBubble({ message }) {
    const isBot = message.role === "bot";
    return (
        <div
            className={`flex items-end gap-2 mb-3 ${isBot ? "justify-start" : "justify-end"}`}
            style={{ animation: "fadeSlideUp 0.2s ease-out" }}
        >
            {isBot && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: COLORS.accentBlue, opacity: 0.9 }}>
                    <Bot size={14} color="#fff" />
                </div>
            )}
            <div
                className="max-w-[75%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-line"
                style={{
                    backgroundColor:         isBot ? "#f1f5f9" : COLORS.accentBlue,
                    color:                   isBot ? COLORS.textPrimary : "#fff",
                    borderBottomLeftRadius:  isBot ? "4px" : "16px",
                    borderBottomRightRadius: isBot ? "16px" : "4px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                }}
            >
                {message.text}
            </div>
            {!isBot && (
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#e2e8f0" }}>
                    <User size={14} style={{ color: COLORS.textSecondary }} />
                </div>
            )}
        </div>
    );
}

function TypingIndicator() {
    return (
        <div className="flex items-end gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: COLORS.accentBlue, opacity: 0.9 }}>
                <Bot size={14} color="#fff" />
            </div>
            <div className="px-3 py-2 rounded-2xl" style={{ backgroundColor: "#f1f5f9", borderBottomLeftRadius: "4px" }}>
                <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                        <span key={i} className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: COLORS.textSecondary, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ChatBotModal({ open, onClose, usuario }) {
    const esAdmin = usuario?.tipo?.toLowerCase() === "admin";
    const opciones = esAdmin ? OPCIONES_ADMIN : OPCIONES_EMPLEADO;

    const [messages, setMessages] = useState([
        { id: 1, role: "bot", text: `¡Hola! 👋 Soy el asistente de Cordilleras.\nElige una opción o escribe tu consulta.` },
    ]);
    const [input,  setInput]  = useState("");
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);
    const inputRef  = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 150);
    }, [open]);

    const enviar = async (texto) => {
        const text = texto.trim();
        if (!text) return;

        setMessages((prev) => [...prev, { id: Date.now(), role: "user", text }]);
        setInput("");
        setTyping(true);

        try {
            const data = await enviarMensaje(text);
            setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: data.respuesta }]);
        } catch {
            setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: "Ocurrió un error. Intenta de nuevo. 😓" }]);
        } finally {
            setTyping(false);
        }
    };

    const handleKey = (e) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(input); }
    };

    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} style={{ backgroundColor: "transparent" }} />

            <div className="fixed z-50 flex flex-col overflow-hidden"
                style={{
                    top: "57px", right: "12px",
                    width: "340px", height: "520px",
                    backgroundColor: "#ffffff",
                    borderRadius: "16px",
                    border: `1px solid ${COLORS.borderColor}`,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
                    animation: "slideDown 0.22s cubic-bezier(0.16,1,0.3,1)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0"
                    style={{ borderColor: COLORS.borderColor, backgroundColor: COLORS.accentBlue, borderRadius: "16px 16px 0 0" }}>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                            <Sparkles size={14} color="#fff" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-white leading-none">Asistente</p>
                            <p className="text-xs text-white/70 mt-0.5">Cordilleras Bot</p>
                        </div>
                    </div>
                    <button onClick={onClose}
                        className="w-7 h-7 rounded-full flex items-center justify-center transition-colors"
                        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)")}>
                        <X size={14} color="#fff" />
                    </button>
                </div>

                {/* Opciones rápidas */}
                <div className="px-3 pt-2 pb-1 flex flex-wrap gap-1.5 border-b flex-shrink-0"
                    style={{ borderColor: COLORS.borderColor, backgroundColor: "#fafafa" }}>
                    {opciones.map((op) => (
                        <button key={op.msg} onClick={() => enviar(op.msg)}
                            className="text-xs px-2.5 py-1 rounded-full border transition-colors hover:bg-blue-50"
                            style={{ borderColor: COLORS.borderColor, color: COLORS.textSecondary, backgroundColor: "#fff" }}>
                            {op.label}
                        </button>
                    ))}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-3 py-3" style={{ scrollbarWidth: "thin" }}>
                    {messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)}
                    {typing && <TypingIndicator />}
                    <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 px-3 py-3 border-t flex-shrink-0"
                    style={{ borderColor: COLORS.borderColor, backgroundColor: "#fafafa" }}>
                    <input ref={inputRef} type="text" value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 text-sm px-3 py-2 rounded-xl border outline-none transition-all"
                        style={{ borderColor: COLORS.borderColor, backgroundColor: "#fff", color: COLORS.textPrimary }}
                        onFocus={(e) => (e.target.style.borderColor = COLORS.accentBlue)}
                        onBlur={(e)  => (e.target.style.borderColor = COLORS.borderColor)}
                    />
                    <button onClick={() => enviar(input)} disabled={!input.trim()}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
                        style={{ backgroundColor: input.trim() ? COLORS.accentBlue : "#e2e8f0", cursor: input.trim() ? "pointer" : "not-allowed" }}>
                        <Send size={14} color={input.trim() ? "#fff" : COLORS.textSecondary} />
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes bounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40%           { transform: translateY(-5px); }
                }
            `}</style>
        </>
    );
}