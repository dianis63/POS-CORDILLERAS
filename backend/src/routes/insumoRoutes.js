import { Router } from 'express';
import * as insumoController from '../controllers/insumoController.js';

const router = Router();
router.get('/',    insumoController.getInsumos);
router.post('/',   insumoController.postInsumo);
router.put('/:id', insumoController.putInsumo);
router.delete('/:id', insumoController.deleteInsumo);
export default router;