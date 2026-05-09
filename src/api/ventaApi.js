const API_URL = '/api/ventas';

export const crearVenta = async (data) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const completarPago = async (idVenta) => {
    const res = await fetch(`${API_URL}/${idVenta}/pagar`, { method: 'PUT' });
    return res.json();
};

export const getVentas = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const cancelarVenta = async (idVenta) => {
    const res = await fetch(`${API_URL}/${idVenta}`, { method: 'DELETE' });
    return res.json();
};

export const getVentaPorId = async (id) => {
    const res = await fetch(`${API_URL}/${id}`);
    return res.json();
};

export const actualizarVenta = async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
};