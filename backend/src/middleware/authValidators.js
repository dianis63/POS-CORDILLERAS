import { body } from 'express-validator';
import { runValidations } from './validators.js';

export const validarLogin = runValidations([
    body('usuario')
        .notEmpty().withMessage('El usuario es requerido'),
    body('contrasena')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
]);