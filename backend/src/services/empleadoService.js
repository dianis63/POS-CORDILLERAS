import pool from '../db.js';

export const getEmpleados = async () => {
    const result = await pool.query(`
        SELECT 
            e.IdEmpleado,
            e.NombreEmpleado,
            e.ApellidoEmpleado,
            e.TelefonoEmpleado,
            e.CargoEmpleado,
            e.SalarioEmpleado,
            u.Usuario,
            u.TipoUsuario
        FROM EMPLEADO e
        JOIN USUARIO u ON e.IdUsuario = u.IdUsuario
        ORDER BY e.IdEmpleado ASC
    `);
    return result.rows;
};

export const crearEmpleado = async (datos) => {
    const { nombreEmpleado, apellidoEmpleado, telefonoEmpleado, cargoEmpleado, salarioEmpleado, usuario, contrasena, tipoUsuario } = datos;

    // Crear usuario primero (el trigger hashea la contraseña)
    const resUsuario = await pool.query(
        `INSERT INTO USUARIO (TipoUsuario, Usuario, ContraseniaUsuario)
         VALUES ($1, $2, $3) RETURNING IdUsuario`,
        [tipoUsuario, usuario, contrasena]
    );

    const idUsuario = resUsuario.rows[0].idusuario;

    // Crear empleado
    const resEmpleado = await pool.query(
        `INSERT INTO EMPLEADO (NombreEmpleado, ApellidoEmpleado, TelefonoEmpleado, CargoEmpleado, SalarioEmpleado, IdUsuario)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [nombreEmpleado, apellidoEmpleado, telefonoEmpleado, cargoEmpleado, salarioEmpleado, idUsuario]
    );

    return resEmpleado.rows[0];
};

export const actualizarEmpleado = async (idEmpleado, datos) => {
    const { nombreEmpleado, apellidoEmpleado, telefonoEmpleado, cargoEmpleado, salarioEmpleado, contrasena } = datos;

    await pool.query(
        `UPDATE EMPLEADO
         SET NombreEmpleado   = $1,
             ApellidoEmpleado = $2,
             TelefonoEmpleado = $3,
             CargoEmpleado    = $4,
             SalarioEmpleado  = $5
         WHERE IdEmpleado = $6`,
        [nombreEmpleado, apellidoEmpleado, telefonoEmpleado, cargoEmpleado, salarioEmpleado, idEmpleado]
    );

    // Actualizar contraseña solo si se proporcionó (el trigger la hashea)
    if (contrasena) {
        const res = await pool.query(
            `SELECT IdUsuario FROM EMPLEADO WHERE IdEmpleado = $1`, [idEmpleado]
        );
        const idUsuario = res.rows[0].idusuario;
        await pool.query(
            `UPDATE USUARIO SET ContraseniaUsuario = $1 WHERE IdUsuario = $2`,
            [contrasena, idUsuario]
        );
    }

    return true;
};

export const eliminarEmpleado = async (idEmpleado) => {
    // Obtener idUsuario antes de eliminar
    const res = await pool.query(
        `SELECT IdUsuario FROM EMPLEADO WHERE IdEmpleado = $1`,
        [idEmpleado]
    );

    if (res.rows.length === 0) return null;

    const idUsuario = res.rows[0].idusuario;

    await pool.query(`DELETE FROM EMPLEADO WHERE IdEmpleado = $1`, [idEmpleado]);
    await pool.query(`DELETE FROM USUARIO   WHERE IdUsuario  = $1`, [idUsuario]);

    return true;
};