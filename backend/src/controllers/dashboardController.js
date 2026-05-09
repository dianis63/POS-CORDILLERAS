import * as dashboardService from '../services/dashboardService.js';

export const getEstadisticas = async (req, res) => {
    try {
        const data = await dashboardService.getEstadisticas();
        res.json(data);
    } catch (err) {
        console.error('Error getEstadisticas:', err);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
};

export const getNotifs = async (req, res) => {
    try {
        const data = await dashboardService.getNotifs();
        res.json(data);
    } catch (err) {
        console.error('Error getNotifs:', err);
        res.status(500).json({ message: 'Error al obtener notificaciones' });
    }
};