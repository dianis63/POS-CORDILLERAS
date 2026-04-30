import * as authService from '../services/authService.js';

export const postLogin = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        const user = await authService.loginUsuario(usuario, contrasena);

        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        req.session.usuario = {
            id:     user.idusuario,
            tipo:   user.tipousuario,
            nombre: user.usuario,
        };

        return res.json({ ok: true, usuario: req.session.usuario });

    } catch (err) {
        console.error('Error en login:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export const getSesion = (req, res) => {
    const usuario = authService.getSesionUsuario(req.session);
    if (!usuario) return res.status(401).json({ ok: false });
    return res.json({ ok: true, usuario });
};

export const postLogout = (req, res) => {
    req.session.destroy();
    return res.json({ ok: true });
};