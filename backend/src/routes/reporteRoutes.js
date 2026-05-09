import { Router } from 'express';
import * as reporteController from '../controllers/reporteController.js';

const router = Router();

router.get('/ventas-totales',   reporteController.getVentasTotales);
router.get('/ventas-productos', reporteController.getVentasProductos);
router.get('/ventas-categorias',reporteController.getVentasCategorias);
router.get('/auditoria',        reporteController.getAuditoria);
router.post('/acceso',          reporteController.postRegistrarAcceso);
router.post('/descarga', reporteController.postRegistrarDescarga);

export default router;