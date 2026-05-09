import pool from '../db.js';

// ── Ventas totales ────────────────────────────────────────────
export const getVentasTotales = async (fecha) => {
    let query = `
        SELECT
            LPAD(v.IdVenta::TEXT, 6, '0') AS id,
            o.NombreCliente                AS cliente,
            o.CantidadProducto             AS cantidadproductos,
            o.Total                        AS totalventa,
            v.FechaVenta                   AS fecha,
            v.HoraOrden                    AS hora
        FROM VENTA v
        JOIN ORDEN o ON v.IdVenta = o.IdVenta
        WHERE v.EstadoVenta = 'pagado'
    `;
    const params = [];
    if (fecha) {
        params.push(fecha);
        query += ` AND v.FechaVenta = $1`;
    }
    query += ` ORDER BY v.FechaVenta ASC, v.HoraOrden ASC`;

    const { rows } = await pool.query(query, params);
    return rows;
};

// ── Ventas por productos ──────────────────────────────────────
export const getVentasProductos = async (fecha) => {
    let query = `
        SELECT
            p.NombreProducto                                    AS nombre,
            SUM(oxp.Cantidad)                                   AS cantidadproductos,
            p.TamanioProducto                                   AS tamanio,
            p.PrecioUnitario                                    AS preciounitario,
            SUM(oxp.Cantidad * p.PrecioUnitario)                AS total,
            v.FechaVenta                                        AS fecha
        FROM ORDENXPRODUCTO oxp
        JOIN PRODUCTO p  ON oxp.IdProducto = p.IdProducto
        JOIN ORDEN o     ON oxp.IdOrden    = o.IdOrden
        JOIN VENTA v     ON o.IdVenta      = v.IdVenta
        WHERE v.EstadoVenta = 'pagado'
    `;
    const params = [];
    if (fecha) {
        params.push(fecha);
        query += ` AND v.FechaVenta = $1`;
    }
    query += ` GROUP BY p.NombreProducto, p.TamanioProducto, p.PrecioUnitario, v.FechaVenta
               ORDER BY total DESC`;

    const { rows } = await pool.query(query, params);
    return rows;
};

// ── Ventas por categoría ──────────────────────────────────────
export const getVentasCategorias = async (fecha) => {
    let query = `
        SELECT
            c.NombreCategoria                                   AS categoria,
            SUM(oxp.Cantidad)                                   AS cantidadproductos,
            SUM(oxp.Cantidad * p.PrecioUnitario)                AS total,
            v.FechaVenta                                        AS fecha
        FROM ORDENXPRODUCTO oxp
        JOIN PRODUCTO p  ON oxp.IdProducto = p.IdProducto
        JOIN CATEGORIA c ON p.IdCategoria  = c.IdCategoria
        JOIN ORDEN o     ON oxp.IdOrden    = o.IdOrden
        JOIN VENTA v     ON o.IdVenta      = v.IdVenta
        WHERE v.EstadoVenta = 'pagado'
    `;
    const params = [];
    if (fecha) {
        params.push(fecha);
        query += ` AND v.FechaVenta = $1`;
    }
    query += ` GROUP BY c.NombreCategoria, v.FechaVenta
               ORDER BY total DESC`;

    const { rows } = await pool.query(query, params);
    return rows;
};

// ── Auditoría de reportes ─────────────────────────────────────
export const getAuditoria = async (fecha) => {
    const { rows } = await pool.query(`
        SELECT 
            LPAD(a.IdAuditoria::TEXT, 6, '0')   AS idreporte,
            LPAD(a.IdUsuario::TEXT, 6, '0')      AS idusuario,
            t.NombreReporte                       AS tiporeporte,
            a.FechaAccion                         AS fechareporte,
            a.Accion                              AS accion
        FROM AUDITORIA_REPORTE a
        JOIN REPORTE r      ON a.IdReporte     = r.IdReporte
        JOIN TIPOREPORTE t  ON r.IdTipoReporte = t.IdTipoReporte
        ${fecha ? 'WHERE a.FechaAccion = $1' : ''}
        ORDER BY a.FechaAccion DESC, a.HoraAccion DESC
    `, fecha ? [fecha] : []);
    return rows;
};

export const registrarAcceso = async (idTipoReporte, idUsuario) => {
    const fecha = new Date().toLocaleDateString('en-CA', { timeZone: 'America/El_Salvador' });
    const hora  = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/El_Salvador' });

    const resReporte = await pool.query(
        `INSERT INTO REPORTE (IdUsuario, FechaReporte, IdTipoReporte)
         VALUES ($1, $2, $3) RETURNING IdReporte`,
        [idUsuario, fecha, idTipoReporte]
    );
    const idReporte = resReporte.rows[0].idreporte;

    await pool.query(
        `INSERT INTO AUDITORIA_REPORTE (IdReporte, IdUsuario, FechaAccion, HoraAccion, Accion)
         VALUES ($1, $2, $3, $4, 'CONSULTADO')`,
        [idReporte, idUsuario, fecha, hora]
    );

    return idReporte;
};

export const registrarDescarga = async (idTipoReporte, idUsuario) => {
    const fecha = new Date().toLocaleDateString('en-CA', { timeZone: 'America/El_Salvador' });
    const hora  = new Date().toLocaleTimeString('en-GB', { timeZone: 'America/El_Salvador' });

    const resReporte = await pool.query(
        `INSERT INTO REPORTE (IdUsuario, FechaReporte, IdTipoReporte)
         VALUES ($1, $2, $3) RETURNING IdReporte`,
        [idUsuario, fecha, idTipoReporte]
    );
    const idReporte = resReporte.rows[0].idreporte;

    await pool.query(
        `INSERT INTO AUDITORIA_REPORTE (IdReporte, IdUsuario, FechaAccion, HoraAccion, Accion)
         VALUES ($1, $2, $3, $4, 'GENERADO')`,
        [idReporte, idUsuario, fecha, hora]
    );

    return idReporte;
};