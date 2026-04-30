const API_URL = '/api/auth';

export const loginUsuario = async (usuario, contrasena) => {
    const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena }),
    });
    return res.json();
};

export const getSesion = async () => {
    const res = await fetch(`${API_URL}/sesion`);
    return res.json();
};

export const logoutUsuario = async () => {
    const res = await fetch(`${API_URL}/logout`, { method: 'POST' });
    return res.json();
};