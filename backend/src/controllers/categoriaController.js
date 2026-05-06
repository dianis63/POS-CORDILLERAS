import * as categoriaService from '../services/categoriaService.js';

export const getCategorias = async (req, res) => {
    try {
        const data = await categoriaService.getCategorias();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener categorías' });
    }
};

export const postCategoria = async (req, res) => {
    try {
        const data = await categoriaService.crearCategoria(req.body);
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear categoría' });
    }
};

export const putCategoria = async (req, res) => {
    try {
        const data = await categoriaService.actualizarCategoria(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: 'Categoría no encontrada' });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar categoría' });
    }
};

export const deleteCategoria = async (req, res) => {
    try {
        await categoriaService.eliminarCategoria(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar categoría' });
    }
};