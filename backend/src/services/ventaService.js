import pool from '../db.js';

export const crearVenta = async (datos) => {
    const { nombreCliente, nota, items, idUsuario } = datos;

    const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const total    = subtotal;
    const cantidad = items.reduce((acc, i) => acc + i.cantidad, 0);

    const now   = new Date();
    const fecha = now.toLocaleDateString('en-CA', { timeZone: 'America/El_Salvador' }); 
    const hora  = now.toLocaleTimeString('en-GB', { timeZone: 'America/El_Salvador' });

    // Crear venta
    const resVenta = await pool.query(
        `INSERT INTO VENTA (EstadoVenta, FechaVenta, HoraOrden, IdUsuario)
         VALUES ('sin-pagar', $1, $2, $3) RETURNING IdVenta`,
        [fecha, hora, idUsuario]
    );
    const idVenta = resVenta.rows[0].idventa;

    // Si no hay nombre, generar código consecutivo
    let clienteFinal = nombreCliente?.trim();
    if (!clienteFinal) {
        const { rows } = await pool.query(
            `SELECT LPAD(nextval('orden_cliente_seq')::TEXT, 6, '0') AS codigo`
        );
        clienteFinal = rows[0].codigo;
    }

    // Crear orden
    const resOrden = await pool.query(
        `INSERT INTO ORDEN (NombreCliente, CantidadProducto, SubTotal, Total, NotaOrden, IdVenta)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING IdOrden`,
        [clienteFinal, cantidad, subtotal, total, nota || null, idVenta]
    );
    const idOrden = resOrden.rows[0].idorden;

    // Crear ordenxproducto
    for (const item of items) {
        await pool.query(
            `INSERT INTO ORDENXPRODUCTO (IdOrden, IdProducto, Cantidad)
             VALUES ($1, $2, $3)`,
            [idOrden, item.id, item.cantidad]
        );
    }

    return { idVenta, idOrden };
};

export const completarPago = async (idVenta) => {
    const result = await pool.query(
        `UPDATE VENTA SET EstadoVenta = 'pagado'
         WHERE IdVenta = $1 RETURNING *`,
        [idVenta]
    );
    return result.rows[0];
};

export const getVentas = async () => {
    const result = await pool.query(`
        SELECT 
            v.IdVenta, v.EstadoVenta, v.FechaVenta, v.HoraOrden,
            o.IdOrden, o.NombreCliente, o.CantidadProducto,
            o.SubTotal, o.Total, o.NotaOrden
        FROM VENTA v
        JOIN ORDEN o ON v.IdVenta = o.IdVenta
        ORDER BY v.FechaVenta DESC, v.HoraOrden DESC
    `);
    return result.rows;
};

export const cancelarVenta = async (idVenta) => {
    await pool.query(`DELETE FROM ORDENXPRODUCTO WHERE IdOrden IN (
        SELECT IdOrden FROM ORDEN WHERE IdVenta = $1
    )`, [idVenta]);
    await pool.query(`DELETE FROM ORDEN WHERE IdVenta = $1`, [idVenta]);
    await pool.query(`DELETE FROM VENTA WHERE IdVenta = $1`, [idVenta]);
    return true;
};

export const getVentaPorId = async (idVenta) => {
    const resVenta = await pool.query(`
        SELECT v.IdVenta, v.EstadoVenta, v.FechaVenta, v.HoraOrden,
               o.IdOrden, o.NombreCliente, o.CantidadProducto,
               o.SubTotal, o.Total, o.NotaOrden
        FROM VENTA v
        JOIN ORDEN o ON v.IdVenta = o.IdVenta
        WHERE v.IdVenta = $1
    `, [idVenta]);

    if (resVenta.rows.length === 0) return null;

    const resItems = await pool.query(`
        SELECT oxp.IdProducto, oxp.Cantidad,
               p.NombreProducto, p.PrecioUnitario, p.TamanioProducto
        FROM ORDENXPRODUCTO oxp
        JOIN PRODUCTO p ON oxp.IdProducto = p.IdProducto
        WHERE oxp.IdOrden = $1
    `, [resVenta.rows[0].idorden]);

    return {
        ...resVenta.rows[0],
        items: resItems.rows.map((r) => ({
            id:       r.idproducto,
            nombre:   r.nombreproducto,
            precio:   Number(r.preciounitario),
            talla:    r.tamanioproducto,
            cantidad: r.cantidad,
        })),
    };
};

export const actualizarVenta = async (idVenta, datos) => {
    const { nombreCliente, nota, items } = datos;

    const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
    const cantidad = items.reduce((acc, i) => acc + i.cantidad, 0);

    // Si se borra el nombre, mantener el que ya tiene en BD
    let clienteFinal = nombreCliente?.trim();
    if (!clienteFinal) {
        const { rows } = await pool.query(
            `SELECT NombreCliente FROM ORDEN WHERE IdVenta = $1`, [idVenta]
        );
        clienteFinal = rows[0]?.nombrecliente || '';
    }

    await pool.query(
        `UPDATE ORDEN SET NombreCliente=$1, CantidadProducto=$2,
                          SubTotal=$3, Total=$4, NotaOrden=$5
         WHERE IdVenta=$6`,
        [clienteFinal, cantidad, subtotal, subtotal, nota || null, idVenta]
    );

    const resOrden = await pool.query(
        `SELECT IdOrden FROM ORDEN WHERE IdVenta=$1`, [idVenta]
    );
    const idOrden = resOrden.rows[0].idorden;

    await pool.query(`DELETE FROM ORDENXPRODUCTO WHERE IdOrden=$1`, [idOrden]);
    for (const item of items) {
        await pool.query(
            `INSERT INTO ORDENXPRODUCTO (IdOrden, IdProducto, Cantidad)
             VALUES ($1, $2, $3)`,
            [idOrden, item.id, item.cantidad]
        );
    }
    return true;
};