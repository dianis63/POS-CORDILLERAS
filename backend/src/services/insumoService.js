import pool from '../db.js';

export const getInsumos = async () => {
    const result = await pool.query(
        `SELECT IdInsumo, NombreInsumo, MedidaInsumo, StockInsumo,
                StockMinimo, PrecioInsumo, FechaVencimiento, FechaUltimaCompra
         FROM INSUMO ORDER BY IdInsumo ASC`
    );
    return result.rows;
};

export const crearInsumo = async (datos) => {
    const { nombreInsumo, medidaInsumo, stockInsumo, stockMinimo,
            precioInsumo, fechaVencimiento, fechaUltimaCompra, idUsuario } = datos;
    const result = await pool.query(
        `INSERT INTO INSUMO (NombreInsumo, MedidaInsumo, StockInsumo, StockMinimo,
                             PrecioInsumo, FechaVencimiento, FechaUltimaCompra, IdUsuario)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [nombreInsumo, medidaInsumo, stockInsumo, stockMinimo,
         precioInsumo, fechaVencimiento || null, fechaUltimaCompra || null, idUsuario]
    );
    return result.rows[0];
};

export const actualizarInsumo = async (id, datos) => {
    const { nombreInsumo, medidaInsumo, stockInsumo, stockMinimo,
            precioInsumo, fechaVencimiento, fechaUltimaCompra } = datos;
    const result = await pool.query(
        `UPDATE INSUMO SET NombreInsumo=$1, MedidaInsumo=$2, StockInsumo=$3,
                           StockMinimo=$4, PrecioInsumo=$5, FechaVencimiento=$6,
                           FechaUltimaCompra=$7
         WHERE IdInsumo=$8 RETURNING *`,
        [nombreInsumo, medidaInsumo, stockInsumo, stockMinimo,
         precioInsumo, fechaVencimiento || null, fechaUltimaCompra || null, id]
    );
    return result.rows[0];
};

export const eliminarInsumo = async (id) => {
    await pool.query(`DELETE FROM INSUMO WHERE IdInsumo = $1`, [id]);
    return true;
};