import pool from '../db.js';

export const loginUsuario = async (usuario, contrasena) => {
    const result = await pool.query(
        'SELECT * FROM verificar_contrasena($1, $2)',
        [usuario, contrasena]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0]; // { idusuario, tipousuario, usuario }
};

export const getSesionUsuario = (session) => {
    return session.usuario || null;
};