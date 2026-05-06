import { Router } from 'express';
import * as empleadoController from '../controllers/empleadoController.js';

const router = Router();

router.get('/',    empleadoController.getEmpleados);
router.post('/',   empleadoController.postEmpleado);
router.put('/:id', empleadoController.putEmpleado);
router.delete('/:id', empleadoController.deleteEmpleado);

export default router;