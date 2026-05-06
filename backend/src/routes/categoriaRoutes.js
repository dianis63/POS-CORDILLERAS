import { Router } from 'express';
import * as categoriaController from '../controllers/categoriaController.js';

const router = Router();
router.get('/',    categoriaController.getCategorias);
router.post('/',   categoriaController.postCategoria);
router.put('/:id', categoriaController.putCategoria);
router.delete('/:id', categoriaController.deleteCategoria);
export default router;