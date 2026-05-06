import pool from '../db.js';

export const getProductos = async () => {
    const result = await pool.query(`
        SELECT p.IdProducto, p.NombreProducto, p.TamanioProducto,
               p.PrecioUnitario, p.EstadoProducto,
               c.IdCategoria, c.NombreCategoria
        FROM PRODUCTO p
        JOIN CATEGORIA c ON p.IdCategoria = c.IdCategoria
        ORDER BY p.IdProducto ASC
    `);
    return result.rows;
};

export const crearProducto = async (datos) => {
    const { nombreProducto, tamanioProducto, precioUnitario, estadoProducto, idCategoria } = datos;
    const result = await pool.query(
        `INSERT INTO PRODUCTO (NombreProducto, TamanioProducto, PrecioUnitario, EstadoProducto, IdCategoria)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [nombreProducto, tamanioProducto, precioUnitario, estadoProducto, idCategoria]
    );
    return result.rows[0];
};

export const actualizarProducto = async (id, datos) => {
    const { nombreProducto, tamanioProducto, precioUnitario, estadoProducto, idCategoria } = datos;
    const result = await pool.query(
        `UPDATE PRODUCTO SET NombreProducto=$1, TamanioProducto=$2,
                             PrecioUnitario=$3, EstadoProducto=$4, IdCategoria=$5
         WHERE IdProducto=$6 RETURNING *`,
        [nombreProducto, tamanioProducto, precioUnitario, estadoProducto, idCategoria, id]
    );
    return result.rows[0];
};

export const eliminarProducto = async (id) => {
    await pool.query(`DELETE FROM PRODUCTO WHERE IdProducto = $1`, [id]);
    return true;
};