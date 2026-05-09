const API_URL = '/api/reportes';

export const getVentasTotales = async (fecha) => {
    const url = fecha ? `${API_URL}/ventas-totales?fecha=${fecha}` : `${API_URL}/ventas-totales`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener ventas totales');
    return res.json();
};

export const getVentasProductos = async (fecha) => {
    const url = fecha ? `${API_URL}/ventas-productos?fecha=${fecha}` : `${API_URL}/ventas-productos`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener ventas por productos');
    return res.json();
};

export const getVentasCategorias = async (fecha) => {
    const url = fecha ? `${API_URL}/ventas-categorias?fecha=${fecha}` : `${API_URL}/ventas-categorias`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener ventas por categoría');
    return res.json();
};

export const getAuditoria = async (fecha) => {
    const url = fecha ? `${API_URL}/auditoria?fecha=${fecha}` : `${API_URL}/auditoria`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al obtener auditoría');
    return res.json();
};

export const registrarAcceso = async (idTipoReporte) => {
    const res = await fetch(`${API_URL}/acceso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idTipoReporte }),
    });
    return res.json();
};

export const registrarDescarga = async (idTipoReporte) => {
    const res = await fetch('/api/reportes/descarga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idTipoReporte }),
    });
    if (!res.ok) throw new Error('Error al registrar descarga');
    return res.json();
};