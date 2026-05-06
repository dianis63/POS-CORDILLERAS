import * as productoService from '../services/productoService.js';

export const getProductos = async (req, res) => {
    try {
        const data = await productoService.getProductos();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
};

export const postProducto = async (req, res) => {
    try {
        const data = await productoService.crearProducto(req.body);
        res.status(201).json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear producto' });
    }
};

export const putProducto = async (req, res) => {
    try {
        const data = await productoService.actualizarProducto(req.params.id, req.body);
        if (!data) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar producto' });
    }
};

export const deleteProducto = async (req, res) => {
    try {
        await productoService.eliminarProducto(req.params.id);
        res.json({ ok: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al eliminar producto' });
    }
};