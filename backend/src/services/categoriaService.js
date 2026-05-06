import pool from '../db.js';

export const getCategorias = async () => {
    const result = await pool.query(
        `SELECT IdCategoria, NombreCategoria, DescripcionCategoria
         FROM CATEGORIA ORDER BY IdCategoria ASC`
    );
    return result.rows;
};

export const crearCategoria = async ({ nombreCategoria, descripcionCategoria }) => {
    const result = await pool.query(
        `INSERT INTO CATEGORIA (NombreCategoria, DescripcionCategoria)
         VALUES ($1, $2) RETURNING *`,
        [nombreCategoria, descripcionCategoria]
    );
    return result.rows[0];
};

export const actualizarCategoria = async (id, { nombreCategoria, descripcionCategoria }) => {
    const result = await pool.query(
        `UPDATE CATEGORIA SET NombreCategoria = $1, DescripcionCategoria = $2
         WHERE IdCategoria = $3 RETURNING *`,
        [nombreCategoria, descripcionCategoria, id]
    );
    return result.rows[0];
};

export const eliminarCategoria = async (id) => {
    await pool.query(`DELETE FROM CATEGORIA WHERE IdCategoria = $1`, [id]);
    return true;
};