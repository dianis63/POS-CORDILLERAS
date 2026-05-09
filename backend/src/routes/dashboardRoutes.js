import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';

const router = Router();
router.get('/',       dashboardController.getEstadisticas);
router.get('/notifs', dashboardController.getNotifs);      // ← nuevo

export default router;