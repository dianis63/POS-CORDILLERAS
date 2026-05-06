const API_URL = '/api/empleados';

export const getEmpleados = async () => {
    const res = await fetch(API_URL);
    return res.json();
};

export const crearEmpleado = async (data) => {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const actualizarEmpleado = async (id, data) => {
    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    return res.json();
};

export const eliminarEmpleado = async (id) => {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    return res.json();
};