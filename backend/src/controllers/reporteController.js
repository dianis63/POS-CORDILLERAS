import * as reporteService from '../services/reporteService.js';

export const getVentasTotales = async (req, res) => {
    try {
        const { fecha } = req.query;
        const data = await reporteService.getVentasTotales(fecha || null);
        res.json(data);
    } catch (err) {
        console.error('Error getVentasTotales:', err);
        res.status(500).json({ message: 'Error al obtener ventas totales' });
    }
};

export const getVentasProductos = async (req, res) => {
    try {
        const { fecha } = req.query;
        const data = await reporteService.getVentasProductos(fecha || null);
        res.json(data);
    } catch (err) {
        console.error('Error getVentasProductos:', err);
        res.status(500).json({ message: 'Error al obtener ventas por productos' });
    }
};

export const getVentasCategorias = async (req, res) => {
    try {
        const { fecha } = req.query;
        const data = await reporteService.getVentasCategorias(fecha || null);
        res.json(data);
    } catch (err) {
        console.error('Error getVentasCategorias:', err);
        res.status(500).json({ message: 'Error al obtener ventas por categoría' });
    }
};

export const getAuditoria = async (req, res) => {
    try {
        const { fecha } = req.query;
        const data = await reporteService.getAuditoria(fecha || null);
        res.json(data);
    } catch (err) {
        console.error('Error getAuditoria:', err);
        res.status(500).json({ message: 'Error al obtener auditoría' });
    }
};

export const postRegistrarAcceso = async (req, res) => {
    try {
        const idUsuario      = req.session.usuario?.id || 1;
        const { idTipoReporte } = req.body;
        await reporteService.registrarAcceso(idTipoReporte, idUsuario);
        res.json({ ok: true });
    } catch (err) {
        console.error('Error postRegistrarAcceso:', err);
        res.status(500).json({ message: 'Error al registrar acceso' });
    }
};

export const postRegistrarDescarga = async (req, res) => {
    try {
        const idUsuario = req.session.usuario?.id || 1;
        const { idTipoReporte } = req.body;
        await reporteService.registrarDescarga(idTipoReporte, idUsuario);
        res.json({ ok: true });
    } catch (err) {
        console.error('Error postRegistrarDescarga:', err);
        res.status(500).json({ message: 'Error al registrar descarga' });
    }
};