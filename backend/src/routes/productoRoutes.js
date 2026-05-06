import { Router } from 'express';
import * as productoController from '../controllers/productoController.js';

const router = Router();
router.get('/',    productoController.getProductos);
router.post('/',   productoController.postProducto);
router.put('/:id', productoController.putProducto);
router.delete('/:id', productoController.deleteProducto);
export default router;