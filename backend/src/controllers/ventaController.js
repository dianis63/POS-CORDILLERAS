import * as ventaService from '../services/ventaService.js';

export const postVenta = async (req, res) => {
    try {
        const idUsuario = req.session.usuario?.id || 1;
        const data = await ventaService.crearVenta({ ...req.body, idUsuario });
        res.status(201).json(data);
    } catch (err) {
        console.error('Error postVenta:', err);
        res.status(500).json({ message: 'Error al crear la venta' });
    }
};

export const putCompletarPago = async (req, res) => {
    try {
        const data = await ventaService.completarPago(req.params.id);
        res.json(data);
    } catch (err) {
        console.error('Error putCompletarPago:', err);
        res.status(500).json({ message: 'Error al completar el pago' });
    }
};

export const getVentas = async (req, res) => {
    try {
        const data = await ventaService.getVentas();
        res.json(data);
    } catch (err) {
        console.error('Error getVentas:', err);
        res.status(500).json({ message: 'Error al obtener ventas' });
    }
};

export const deleteVenta = async (req, res) => {
    try {
        await ventaService.cancelarVenta(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error('Error deleteVenta:', err);
        res.status(500).json({ message: 'Error al cancelar la venta' });
    }
};

export const getVentaById = async (req, res) => {
    try {
        const data = await ventaService.getVentaPorId(req.params.id);
        if (!data) return res.status(404).json({ message: 'Venta no encontrada' });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener la venta' });
    }
};

export const putVenta = async (req, res) => {
    try {
        await ventaService.actualizarVenta(req.params.id, req.body);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar la venta' });
    }
};