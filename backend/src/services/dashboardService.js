import pool from '../db.js';

export const getEstadisticas = async () => {
    const { rows: ventasPagadas } = await pool.query(`
        SELECT v.IdVenta, o.Total, o.NombreCliente, o.CantidadProducto
        FROM VENTA v
        JOIN ORDEN o ON v.IdVenta = o.IdVenta
        WHERE v.EstadoVenta = 'pagado'
    `);

    const ingresos           = ventasPagadas.reduce((acc, v) => acc + Number(v.total), 0);
    const pedidosCompletados = ventasPagadas.length;
    const productosVendidos  = ventasPagadas.reduce((acc, v) => acc + v.cantidadproducto, 0);

    const { rows: ventasHoy } = await pool.query(`
        SELECT o.Total
        FROM VENTA v
        JOIN ORDEN o ON v.IdVenta = o.IdVenta
        WHERE v.EstadoVenta = 'pagado'
          AND v.FechaVenta = CURRENT_DATE
    `);
    const ingresosHoy = ventasHoy.reduce((acc, v) => acc + Number(v.total), 0);

    const { rows: empleadoTop } = await pool.query(`
        SELECT e.NombreEmpleado || ' ' || e.ApellidoEmpleado AS nombre,
               COUNT(v.IdVenta) AS ventas
        FROM VENTA v
        JOIN EMPLEADO e ON v.IdUsuario = e.IdUsuario
        WHERE v.EstadoVenta = 'pagado'
          AND DATE_TRUNC('month', v.FechaVenta) = DATE_TRUNC('month', CURRENT_DATE)
        GROUP BY e.NombreEmpleado, e.ApellidoEmpleado
        ORDER BY ventas DESC
        LIMIT 1
    `);
    const empleadoMes = empleadoTop[0]?.nombre || 'Sin datos';

    const { rows: ventasDiariasRaw } = await pool.query(`
        SELECT 
            TO_CHAR(v.FechaVenta AT TIME ZONE 'America/El_Salvador', 'Dy') AS dia,
            v.FechaVenta,
            SUM(o.Total) AS total
        FROM VENTA v
        JOIN ORDEN o ON v.IdVenta = o.IdVenta
        WHERE v.EstadoVenta = 'pagado'
          AND v.FechaVenta >= CURRENT_DATE - INTERVAL '6 days'
        GROUP BY v.FechaVenta, dia
        ORDER BY v.FechaVenta ASC
    `);

    const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hoy = new Date();
    const ventasDiarias = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(hoy);
        d.setDate(hoy.getDate() - (6 - i));
        const fechaISO = d.toLocaleDateString('en-CA', { timeZone: 'America/El_Salvador' });
        const diaLabel = diasSemana[d.getDay()];
        const found = ventasDiariasRaw.find((r) => {
            const f = r.fechaventa instanceof Date
                ? r.fechaventa.toISOString().split('T')[0]
                : String(r.fechaventa).slice(0, 10);
            return f === fechaISO;
        });
        return { dia: diaLabel, valor: found ? Number(found.total) : 0 };
    });

    const { rows: ventasAnualesRaw } = await pool.query(`
        SELECT 
            TO_CHAR(v.FechaVenta, 'Mon') AS mes,
            EXTRACT(MONTH FROM v.FechaVenta) AS num_mes,
            EXTRACT(YEAR  FROM v.FechaVenta) AS anio,
            SUM(o.Total) AS total
        FROM VENTA v
        JOIN ORDEN o ON v.IdVenta = o.IdVenta
        WHERE v.EstadoVenta = 'pagado'
          AND v.FechaVenta >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '11 months'
        GROUP BY mes, num_mes, anio
        ORDER BY anio, num_mes
    `);

    const mesesLabel = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const ahora = new Date();
    const ventasAnuales = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(ahora.getFullYear(), ahora.getMonth() - 11 + i, 1);
        const mes  = d.getMonth() + 1;
        const anio = d.getFullYear();
        const found = ventasAnualesRaw.find(
            (r) => Number(r.num_mes) === mes && Number(r.anio) === anio
        );
        return { mes: mesesLabel[d.getMonth()], valor: found ? Number(found.total) : 0 };
    });

    const { rows: topProductos } = await pool.query(`
        SELECT p.NombreProducto AS nombre, SUM(oxp.Cantidad) AS valor
        FROM ORDENXPRODUCTO oxp
        JOIN PRODUCTO p ON oxp.IdProducto = p.IdProducto
        JOIN ORDEN o    ON oxp.IdOrden    = o.IdOrden
        JOIN VENTA v    ON o.IdVenta      = v.IdVenta
        WHERE v.EstadoVenta = 'pagado'
        GROUP BY p.NombreProducto
        ORDER BY valor DESC
        LIMIT 4  
    `);

    const productoFavorito = topProductos[0]?.nombre || 'Sin datos';

    const { rows: ventasCat } = await pool.query(`
        SELECT c.NombreCategoria AS nombre, SUM(oxp.Cantidad) AS total
        FROM ORDENXPRODUCTO oxp
        JOIN PRODUCTO p  ON oxp.IdProducto = p.IdProducto
        JOIN CATEGORIA c ON p.IdCategoria  = c.IdCategoria
        JOIN ORDEN o     ON oxp.IdOrden    = o.IdOrden
        JOIN VENTA v     ON o.IdVenta      = v.IdVenta
        WHERE v.EstadoVenta = 'pagado'
        GROUP BY c.NombreCategoria
        ORDER BY total DESC
    `);

    const totalCat    = ventasCat.reduce((acc, c) => acc + Number(c.total), 0) || 1;
    const COLORES_CAT = ['#B0DEFF', '#a5b4fc', '#C5E9CD', '#fda4af', '#fcd34d', '#a5f3fc'];
    const categorias  = ventasCat.map((c, i) => ({
        nombre:     c.nombre,
        porcentaje: parseFloat(((Number(c.total) / totalCat) * 100).toFixed(1)),
        color:      COLORES_CAT[i % COLORES_CAT.length],
    }));

    // ── Notifs — delega a getNotifs para no duplicar lógica ───────
    const { productosVencer, productosAgotar } = await getNotifs();

    return {
        ingresos:            `$ ${ingresos.toFixed(2)}`,
        ingresosHoy:         `$ ${ingresosHoy.toFixed(2)}`,
        pedidosCompletados,
        productosVendidos,
        empleadoMes,
        productoFavorito,
        ventasDiarias,
        ventasAnuales,
        topProductos:        topProductos.map((p) => ({ nombre: p.nombre, valor: Number(p.valor) })),
        categorias,
        productosVencer,
        productosAgotar,
        productosVencerCard: productosVencer.slice(0, 3),
        productosAgotarCard: productosAgotar.slice(0, 3),
    };
};

export const getNotifs = async () => {
    // ── Limpiar notis de stock que ya se recuperaron ──────────────
    await pool.query(`
        DELETE FROM NOTIFICACION
        WHERE TipoNotificacion = 'stock_bajo'
          AND IdInsumo IN (
              SELECT IdInsumo FROM INSUMO WHERE StockInsumo > StockMinimo
          )
    `);

    // ── Limpiar notis de vencimiento que ya no aplican ────────────
    await pool.query(`
        DELETE FROM NOTIFICACION
        WHERE TipoNotificacion = 'vencimiento'
          AND IdInsumo IN (
              SELECT IdInsumo FROM INSUMO
              WHERE FechaVencimiento IS NULL
                 OR FechaVencimiento > CURRENT_DATE + INTERVAL '5 days'
          )
    `);

    // ── Generar/actualizar notificaciones de vencimiento ──────────
    const { rows: insumosVencer } = await pool.query(`
        SELECT IdInsumo, NombreInsumo, FechaVencimiento,
               (FechaVencimiento - CURRENT_DATE) AS dias_restantes
        FROM INSUMO
        WHERE FechaVencimiento IS NOT NULL
          AND FechaVencimiento <= CURRENT_DATE + INTERVAL '5 days'
    `);

    for (const i of insumosVencer) {
        const dias = Number(i.dias_restantes);
        const msg  = dias <= 0
            ? `${i.nombreinsumo} ha vencido`
            : dias === 1
            ? `${i.nombreinsumo} vence mañana`
            : `${i.nombreinsumo} vence en ${dias} días`;

        const existe = await pool.query(
            `SELECT IdNotificacion, Mensaje FROM NOTIFICACION
             WHERE IdInsumo = $1 AND TipoNotificacion = 'vencimiento'`,
            [i.idinsumo]
        );

        if (existe.rows.length === 0) {
            await pool.query(
                `INSERT INTO NOTIFICACION (TipoNotificacion, Mensaje, IdInsumo, Leida)
                 VALUES ('vencimiento', $1, $2, false)`,
                [msg, i.idinsumo]
            );
        } else {
            const mensajeAnterior = existe.rows[0].mensaje;
            if (mensajeAnterior !== msg) {
                await pool.query(
                    `UPDATE NOTIFICACION
                     SET Mensaje = $1, FechaCreacion = NOW()
                     WHERE IdNotificacion = $2`,
                    [msg, existe.rows[0].idnotificacion]
                );
            }
        }
    }

    // ── Generar/actualizar notificaciones de stock bajo ───────────
    const { rows: insumosAgotar } = await pool.query(`
        SELECT IdInsumo, NombreInsumo, StockInsumo, StockMinimo
        FROM INSUMO
        WHERE StockInsumo <= StockMinimo
    `);

    for (const i of insumosAgotar) {
        const msg = i.stockinsumo === 0
            ? `${i.nombreinsumo} sin stock`
            : i.stockinsumo === 1
            ? `${i.nombreinsumo}: solo 1 unidad restante`
            : `${i.nombreinsumo}: solo ${i.stockinsumo} unidades restantes`;

        const existe = await pool.query(
            `SELECT IdNotificacion, Mensaje FROM NOTIFICACION
             WHERE IdInsumo = $1 AND TipoNotificacion = 'stock_bajo'`,
            [i.idinsumo]
        );

        if (existe.rows.length === 0) {
            await pool.query(
                `INSERT INTO NOTIFICACION (TipoNotificacion, Mensaje, IdInsumo, Leida)
                 VALUES ('stock_bajo', $1, $2, false)`,
                [msg, i.idinsumo]
            );
        } else {
            const mensajeAnterior = existe.rows[0].mensaje;
            if (mensajeAnterior !== msg) {
                await pool.query(
                    `UPDATE NOTIFICACION SET Mensaje = $1, FechaCreacion = NOW()
                     WHERE IdNotificacion = $2`,
                    [msg, existe.rows[0].idnotificacion]
                );
            }
        }
    }

    // ── Leer todas las notificaciones ─────────────────────────────
    const { rows: porVencer } = await pool.query(`
        SELECT n.FechaCreacion, i.NombreInsumo,
               (i.FechaVencimiento - CURRENT_DATE) AS dias_restantes
        FROM NOTIFICACION n
        JOIN INSUMO i ON n.IdInsumo = i.IdInsumo
        WHERE n.TipoNotificacion = 'vencimiento'
        ORDER BY i.FechaVencimiento ASC
    `);

    const productosVencer = porVencer.map((n) => {
        const dias         = Number(n.dias_restantes);
        const creacion     = new Date(n.fechacreacion);
        const minutosAtras = Math.floor((Date.now() - creacion) / 60000);
        const horasAtras   = Math.floor(minutosAtras / 60);
        const tiempoTexto  = minutosAtras < 60
            ? `Hace ${minutosAtras} minuto${minutosAtras !== 1 ? 's' : ''}`
            : horasAtras < 24
            ? `Hace ${horasAtras} hora${horasAtras !== 1 ? 's' : ''}`
            : `Hace ${Math.floor(horasAtras / 24)} día${Math.floor(horasAtras / 24) !== 1 ? 's' : ''}`;
        return {
            nombre:   n.nombreinsumo,
            tiempo:   tiempoTexto,
            dias:     dias <= 0 ? 'Vencido' : dias === 1 ? '1 día' : `${dias} días`,
            urgencia: dias <= 0 ? 'red' : dias <= 2 ? 'orange' : 'gray',
        };
    });

    const { rows: porAgotar } = await pool.query(`
        SELECT n.FechaCreacion, i.NombreInsumo, i.StockInsumo
        FROM NOTIFICACION n
        JOIN INSUMO i ON n.IdInsumo = i.IdInsumo
        WHERE n.TipoNotificacion = 'stock_bajo'
        ORDER BY i.StockInsumo ASC
    `);

    const productosAgotar = porAgotar.map((n) => {
        const creacion     = new Date(n.fechacreacion);
        const minutosAtras = Math.floor((Date.now() - creacion) / 60000);
        const horasAtras   = Math.floor(minutosAtras / 60);
        const tiempoTexto  = minutosAtras < 60
            ? `Hace ${minutosAtras} minuto${minutosAtras !== 1 ? 's' : ''}`
            : horasAtras < 24
            ? `Hace ${horasAtras} hora${horasAtras !== 1 ? 's' : ''}`
            : `Hace ${Math.floor(horasAtras / 24)} día${Math.floor(horasAtras / 24) !== 1 ? 's' : ''}`;
        return {
            nombre:   n.nombreinsumo,
            tiempo:   tiempoTexto,
            unidades: n.stockinsumo === 0 ? '0 unidades' : `${n.stockinsumo} unidades`,
            urgencia: n.stockinsumo === 0 ? 'red' : n.stockinsumo <= 2 ? 'orange' : 'gray',
        };
    });

    return { productosVencer, productosAgotar };
};