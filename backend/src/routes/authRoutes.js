import { Router } from 'express';
import { validarLogin } from '../middleware/authValidators.js';
import * as authController from '../controllers/authController.js';

const router = Router();

router.post('/login',  validarLogin, authController.postLogin);
router.get('/sesion',  authController.getSesion);
router.post('/logout', authController.postLogout);

export default router;