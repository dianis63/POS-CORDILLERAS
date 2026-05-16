import * as chatbotService from '../services/chatbotService.js';

export const chat = async (req, res) => {
    try {
        const { mensaje } = req.body;
        const usuario = req.session.usuario;
        if (!mensaje) return res.status(400).json({ message: 'Mensaje requerido' });
        const respuesta = await chatbotService.procesarMensaje(mensaje, usuario);
        res.json({ respuesta });
    } catch (err) {
        console.error('Error chatbot:', err);
        res.status(500).json({ message: 'Error al procesar mensaje' });
    }
};