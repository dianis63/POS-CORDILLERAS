import * as insumoService from '../services/insumoService.js';

export const getInsumos = async (req, res) => {
    try {
        const data = await insumoService.getInsumos();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener insumos' });
    }
};

export const postInsumo = async (req, res) => {
    try {
        // Toma el id del usuario de la sesión
        const idUsuario = req.session.usuario?.id || 1;
        const data = await insumoService.crearInsumo({ ...req.body, idUsuario });
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear insumo' });
    }
};

export const putInsumo = async (req, res) => {
    try {
        const data = await insumoService.actualizarInsumo(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: 'Insumo no encontrado' });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar insumo' });
    }
};

export const deleteInsumo = async (req, res) => {
    try {
        await insumoService.eliminarInsumo(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar insumo' });
    }
};