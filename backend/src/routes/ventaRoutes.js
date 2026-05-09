import { Router } from 'express';
import * as ventaController from '../controllers/ventaController.js';

const router = Router();
router.get('/',              ventaController.getVentas);
router.post('/',             ventaController.postVenta);
router.get('/:id',           ventaController.getVentaById);
router.put('/:id/pagar',     ventaController.putCompletarPago);
router.put('/:id',           ventaController.putVenta);
router.delete('/:id',        ventaController.deleteVenta);
export default router;