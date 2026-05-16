import pool from '../db.js';

export const procesarMensaje = async (mensaje, usuario) => {
    const msg  = mensaje.toLowerCase().trim();
    const rol  = usuario?.tipo?.toLowerCase();
    const idUsuario = usuario?.id;

    if (msg.match(/^(hola|hey|buenas|buenos|buen día|buen dia|hi)$/)) {
        return `¡Hola! 👋 Soy el asistente de Cordilleras. ¿En qué te puedo ayudar${rol === 'admin' ? ', administrador' : ''}?`;
    }

    if (msg.match(/(gracias|ok|listo|bye|adios|adiós|hasta luego)/)) {
        return "¡Con gusto! 😊 Cualquier cosa aquí estaré.";
    }

    if (msg.includes("mis ventas") || msg.includes("vendí hoy") || msg.includes("vendi hoy") || msg.includes("cuánto vendí") || msg.includes("cuanto vendi")) {
        const { rows } = await pool.query(`
            SELECT COUNT(*) AS total, COALESCE(SUM(o.Total), 0) AS monto
            FROM VENTA v
            JOIN ORDEN o ON v.IdVenta = o.IdVenta
            WHERE v.EstadoVenta = 'pagado'
              AND v.FechaVenta = CURRENT_DATE
              AND v.IdUsuario = $1
        `, [idUsuario]);
        const { total, monto } = rows[0];
        return `Hoy llevas ${total} venta${total != 1 ? 's' : ''} completada${total != 1 ? 's' : ''} por un total de $${Number(monto).toFixed(2)}. 💪`;
    }

    if (msg.includes("pendiente") || msg.includes("sin pagar") || msg.includes("en curso")) {
        const { rows } = await pool.query(`
            SELECT COUNT(*) AS total
            FROM VENTA
            WHERE EstadoVenta = 'sin-pagar'
              AND FechaVenta = CURRENT_DATE
        `);
        const total = rows[0].total;
        return `Hay ${total} orden${total != 1 ? 'es' : ''} pendiente${total != 1 ? 's' : ''} de pago en este momento. 🕐`;
    }
    if (msg.includes("última venta") || msg.includes("ultima venta") || msg.includes("última orden") || msg.includes("ultima orden")) {
        const { rows } = await pool.query(`
            SELECT v.IdVenta, o.NombreCliente, o.Total, v.FechaVenta, v.HoraOrden
            FROM VENTA v
            JOIN ORDEN o ON v.IdVenta = o.IdVenta
            ORDER BY v.FechaVenta DESC, v.HoraOrden DESC
            LIMIT 1
        `);
        if (rows.length === 0) return "No hay ventas registradas aún.";
        const v = rows[0];
        const cliente = v.nombrecliente || "Sin nombre";
        const hora = v.horaorden?.slice(0, 5);
        return `La última venta registrada es la N° ${String(v.idventa).padStart(6,'0')} a nombre de ${cliente} por $${Number(v.total).toFixed(2)}, el ${new Date(v.fechaventa).toLocaleDateString('es-SV')} a las ${hora}. 🕐`;
    }

    if (msg.includes("mi resumen") || msg.includes("resumen del mes") || msg.includes("mis ventas del mes") || msg.includes("cuánto llevo") || msg.includes("cuanto llevo")) {
        const { rows } = await pool.query(`
            SELECT COUNT(*) AS total, COALESCE(SUM(o.Total), 0) AS monto
            FROM VENTA v
            JOIN ORDEN o ON v.IdVenta = o.IdVenta
            WHERE v.EstadoVenta = 'pagado'
            AND DATE_TRUNC('month', v.FechaVenta) = DATE_TRUNC('month', CURRENT_DATE)
            AND v.IdUsuario = $1
        `, [idUsuario]);
        const { total, monto } = rows[0];
        return `Este mes llevas ${total} venta${total != 1 ? 's' : ''} completada${total != 1 ? 's' : ''} por un total de $${Number(monto).toFixed(2)}. 📊`;
    }

    if (msg.includes("precio de") || msg.includes("cuánto cuesta") || msg.includes("cuanto cuesta") || msg.includes("buscar producto")) {
        const termino = msg
            .replace(/(precio de|cuánto cuesta|cuanto cuesta|buscar producto)/g, "")
            .trim();

        if (!termino) return "¿Qué producto deseas buscar? Escribe por ejemplo: *precio de café americano*";

        const { rows } = await pool.query(`
            SELECT NombreProducto, PrecioUnitario, TamanioProducto, EstadoProducto
            FROM PRODUCTO
            WHERE LOWER(NombreProducto) LIKE $1
            LIMIT 5
        `, [`%${termino}%`]);

        if (rows.length === 0) return `No encontré productos con el nombre "${termino}". 🔍`;

        const lista = rows.map((p) =>
            `• ${p.nombreproducto}${p.tamanioproducto ? ` (${p.tamanioproducto})` : ''} — $${Number(p.preciounitario).toFixed(2)} [${p.estadoproducto}]`
        ).join('\n');
        return `Encontré estos productos:\n${lista}`;
    }

    if (msg.includes("ayuda") || msg.includes("help") || msg.includes("qué puedes") || msg.includes("que puedes") || msg.includes("opciones")) {
        if (rol === 'admin') {
        return `Puedo ayudarte con:\n• *mis ventas* — tus ventas de hoy\n• *mi resumen del mes* — tus ventas del mes\n• *última venta* — la más reciente\n• *pendientes* — órdenes sin pagar\n• *precio de [producto]* — buscar precio\n• *ventas hoy* — total del negocio hoy\n• *comparar hoy vs ayer* — comparativa\n• *mejor día de la semana* — top del día\n• *producto más vendido* — el top de hoy\n• *categoría más vendida* — categoría top\n• *ranking empleados* — top 3 del mes\n• *ticket promedio* — gasto promedio\n• *total de productos* — catálogo activo\n• *insumos sin stock* — stock en 0\n• *insumos por vencer* — próximos 7 días\n• *ingresos del mes* — resumen mensual`;
        }
        return `Puedo ayudarte con:\n• *mis ventas* — tus ventas de hoy\n• *mi resumen del mes* — tus ventas del mes\n• *última venta* — la más reciente\n• *pendientes* — órdenes sin pagar\n• *precio de [producto]* — buscar precio\n• *ayuda* — ver este menú`;
    }

    if (rol === 'admin') {

        if (msg.includes("ventas hoy") || msg.includes("cuántas ventas") || msg.includes("cuantas ventas")) {
            const { rows } = await pool.query(`
                SELECT COUNT(*) AS total, COALESCE(SUM(o.Total), 0) AS monto
                FROM VENTA v
                JOIN ORDEN o ON v.IdVenta = o.IdVenta
                WHERE v.EstadoVenta = 'pagado'
                  AND v.FechaVenta = CURRENT_DATE
            `);
            const { total, monto } = rows[0];
            return `Hoy se han completado ${total} venta${total != 1 ? 's' : ''} por un total de $${Number(monto).toFixed(2)}. 📊`;
        }

        if (msg.includes("producto más vendido") || msg.includes("producto mas vendido") || msg.includes("más vendido") || msg.includes("mas vendido")) {
            const { rows } = await pool.query(`
                SELECT p.NombreProducto, SUM(oxp.Cantidad) AS total
                FROM ORDENXPRODUCTO oxp
                JOIN PRODUCTO p  ON oxp.IdProducto = p.IdProducto
                JOIN ORDEN o     ON oxp.IdOrden    = o.IdOrden
                JOIN VENTA v     ON o.IdVenta      = v.IdVenta
                WHERE v.EstadoVenta = 'pagado'
                  AND v.FechaVenta = CURRENT_DATE
                GROUP BY p.NombreProducto
                ORDER BY total DESC
                LIMIT 1
            `);
            if (rows.length === 0) return "Todavía no hay ventas pagadas hoy. ☕";
            return `El producto más vendido hoy es **${rows[0].nombreproducto}** con ${rows[0].total} unidades. 🥇`;
        }

        if (msg.includes("ranking") || msg.includes("mejor empleado") || msg.includes("quién más") || msg.includes("quien mas") || msg.includes("quién mas")) {
            const { rows } = await pool.query(`
                SELECT e.NombreEmpleado || ' ' || e.ApellidoEmpleado AS nombre,
                       COUNT(v.IdVenta) AS ventas
                FROM VENTA v
                JOIN EMPLEADO e ON v.IdUsuario = e.IdUsuario
                WHERE v.EstadoVenta = 'pagado'
                  AND DATE_TRUNC('month', v.FechaVenta) = DATE_TRUNC('month', CURRENT_DATE)
                GROUP BY e.NombreEmpleado, e.ApellidoEmpleado
                ORDER BY ventas DESC
                LIMIT 3
            `);
            if (rows.length === 0) return "No hay ventas registradas este mes aún.";
            const lista = rows.map((e, i) =>
                `${i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} ${e.nombre} — ${e.ventas} venta${e.ventas != 1 ? 's' : ''}`
            ).join('\n');
            return `Top empleados del mes:\n${lista}`;
        }

        if (msg.includes("sin stock") || msg.includes("agotado") || msg.includes("sin inventario")) {
            const { rows } = await pool.query(`
                SELECT NombreInsumo, StockInsumo
                FROM INSUMO
                WHERE StockInsumo = 0
                ORDER BY NombreInsumo ASC
            `);
            if (rows.length === 0) return "✅ No hay insumos sin stock actualmente.";
            const lista = rows.map((i) => `• ${i.nombreinsumo}`).join('\n');
            return `Insumos con stock en 0:\n${lista}`;
        }

        if (msg.includes("total empleados") || msg.includes("cuántos empleados") || msg.includes("cuantos empleados") || msg.includes("empleados registrados")) {
            const { rows } = await pool.query(`SELECT COUNT(*) AS total FROM EMPLEADO`);
            return `Hay ${rows[0].total} empleado${rows[0].total != 1 ? 's' : ''} registrado${rows[0].total != 1 ? 's' : ''} en el sistema. 👥`;
        }

        if (msg.includes("ingresos del mes") || msg.includes("ingreso mes") || msg.includes("ventas del mes") || msg.includes("total del mes")) {
            const { rows } = await pool.query(`
                SELECT COALESCE(SUM(o.Total), 0) AS monto, COUNT(*) AS total
                FROM VENTA v
                JOIN ORDEN o ON v.IdVenta = o.IdVenta
                WHERE v.EstadoVenta = 'pagado'
                  AND DATE_TRUNC('month', v.FechaVenta) = DATE_TRUNC('month', CURRENT_DATE)
            `);
            const { monto, total } = rows[0];
            return `Este mes se han generado $${Number(monto).toFixed(2)} en ingresos con ${total} venta${total != 1 ? 's' : ''} completada${total != 1 ? 's' : ''}. 💰`;
        }
        if (msg.includes("comparar") || msg.includes("hoy vs ayer") || msg.includes("ayer")) {
            const { rows } = await pool.query(`
                SELECT 
                    COALESCE(SUM(CASE WHEN v.FechaVenta = CURRENT_DATE      THEN o.Total ELSE 0 END), 0) AS hoy,
                    COALESCE(SUM(CASE WHEN v.FechaVenta = CURRENT_DATE - 1  THEN o.Total ELSE 0 END), 0) AS ayer
                FROM VENTA v
                JOIN ORDEN o ON v.IdVenta = o.IdVenta
                WHERE v.EstadoVenta = 'pagado'
                AND v.FechaVenta >= CURRENT_DATE - 1
            `);
            const hoy  = Number(rows[0].hoy);
            const ayer = Number(rows[0].ayer);
            const diff = hoy - ayer;
            const emoji = diff > 0 ? '📈' : diff < 0 ? '📉' : '➡️';
            const texto = diff > 0
                ? `$${diff.toFixed(2)} más que ayer`
                : diff < 0
                ? `$${Math.abs(diff).toFixed(2)} menos que ayer`
                : `igual que ayer`;
            return `${emoji} Hoy: $${hoy.toFixed(2)} — Ayer: $${ayer.toFixed(2)}\n${emoji} ${texto}.`;
        }

        if (msg.includes("mejor día") || msg.includes("mejor dia") || msg.includes("día de la semana") || msg.includes("dia de la semana")) {
            const { rows } = await pool.query(`
                SELECT 
                    TO_CHAR(v.FechaVenta AT TIME ZONE 'America/El_Salvador', 'Day') AS dia,
                    SUM(o.Total) AS total
                FROM VENTA v
                JOIN ORDEN o ON v.IdVenta = o.IdVenta
                WHERE v.EstadoVenta = 'pagado'
                AND v.FechaVenta >= DATE_TRUNC('week', CURRENT_DATE)
                GROUP BY dia
                ORDER BY total DESC
                LIMIT 1
            `);
            if (rows.length === 0) return "No hay ventas esta semana aún. 📅";
            return `El mejor día de esta semana ha sido el ${rows[0].dia.trim()} con $${Number(rows[0].total).toFixed(2)} en ventas. 🗓️`;
        }

        if (msg.includes("ticket promedio") || msg.includes("promedio") || msg.includes("gasto promedio")) {
            const { rows } = await pool.query(`
                SELECT COALESCE(AVG(o.Total), 0) AS promedio
                FROM VENTA v
                JOIN ORDEN o ON v.IdVenta = o.IdVenta
                WHERE v.EstadoVenta = 'pagado'
                AND DATE_TRUNC('month', v.FechaVenta) = DATE_TRUNC('month', CURRENT_DATE)
            `);
            const promedio = Number(rows[0].promedio);
            return `El ticket promedio este mes es de $${promedio.toFixed(2)} por orden. 💸`;
        }

        if (msg.includes("total de productos") || msg.includes("cuántos productos") || msg.includes("cuantos productos") || msg.includes("productos activos")) {
            const { rows } = await pool.query(`
                SELECT 
                    COUNT(*) FILTER (WHERE EstadoProducto = 'Activo')   AS activos,
                    COUNT(*) FILTER (WHERE EstadoProducto = 'Inactivo') AS inactivos
                FROM PRODUCTO
            `);
            return `Hay ${rows[0].activos} productos activos y ${rows[0].inactivos} inactivos en el catálogo. 🔢`;
        }

        if (msg.includes("categoría más vendida") || msg.includes("categoria mas vendida") || msg.includes("categoria más vendida") || msg.includes("categoría mas vendida")) {
            const { rows } = await pool.query(`
                SELECT c.NombreCategoria, SUM(oxp.Cantidad) AS total
                FROM ORDENXPRODUCTO oxp
                JOIN PRODUCTO p  ON oxp.IdProducto = p.IdProducto
                JOIN CATEGORIA c ON p.IdCategoria  = c.IdCategoria
                JOIN ORDEN o     ON oxp.IdOrden    = o.IdOrden
                JOIN VENTA v     ON o.IdVenta      = v.IdVenta
                WHERE v.EstadoVenta = 'pagado'
                AND v.FechaVenta = CURRENT_DATE
                GROUP BY c.NombreCategoria
                ORDER BY total DESC
                LIMIT 1
            `);
            if (rows.length === 0) return "No hay ventas pagadas hoy todavía. 📦";
            return `La categoría más vendida hoy es **${rows[0].nombrecategoria}** con ${rows[0].total} unidades vendidas. 📦`;
        }

        if (msg.includes("por vencer") || msg.includes("vencer esta semana") || msg.includes("vencen") || msg.includes("vencimiento")) {
            const { rows } = await pool.query(`
                SELECT NombreInsumo, FechaVencimiento,
                    (FechaVencimiento - CURRENT_DATE) AS dias
                FROM INSUMO
                WHERE FechaVencimiento IS NOT NULL
                AND FechaVencimiento <= CURRENT_DATE + INTERVAL '7 days'
                AND FechaVencimiento >= CURRENT_DATE
                ORDER BY FechaVencimiento ASC
            `);
            if (rows.length === 0) return "✅ Ningún insumo vence en los próximos 7 días.";
            const lista = rows.map((i) =>
                `• ${i.nombreinsumo} — vence en ${i.dias} día${i.dias != 1 ? 's' : ''}`
            ).join('\n');
            return `Insumos por vencer esta semana:\n${lista} ⚠️`;
        }
    }

    return `No entendí tu mensaje. 😅 Escribe *ayuda* para ver qué puedo hacer por ti.`;
};