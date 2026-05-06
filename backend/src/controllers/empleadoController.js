import * as empleadoService from '../services/empleadoService.js';

export const getEmpleados = async (req, res) => {
    try {
        const empleados = await empleadoService.getEmpleados();
        res.json(empleados);
    } catch (err) {
        console.error('Error getEmpleados:', err);
        res.status(500).json({ message: 'Error al obtener empleados' });
    }
};

export const postEmpleado = async (req, res) => {
    try {
        const empleado = await empleadoService.crearEmpleado(req.body);
        res.status(201).json(empleado);
    } catch (err) {
        console.error('Error postEmpleado:', err);
        // Usuario duplicado
        if (err.code === '23505') {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }
        res.status(500).json({ message: 'Error al crear empleado' });
    }
};

export const putEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const empleado = await empleadoService.actualizarEmpleado(id, req.body);
        if (!empleado) return res.status(404).json({ message: 'Empleado no encontrado' });
        res.json(empleado);
    } catch (err) {
        console.error('Error putEmpleado:', err);
        res.status(500).json({ message: 'Error al actualizar empleado' });
    }
};

export const deleteEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await empleadoService.eliminarEmpleado(id);
        if (!result) return res.status(404).json({ message: 'Empleado no encontrado' });
        res.json({ ok: true });
    } catch (err) {
        console.error('Error deleteEmpleado:', err);
        res.status(500).json({ message: 'Error al eliminar empleado' });
    }
};