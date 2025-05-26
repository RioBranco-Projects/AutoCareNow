import { Router } from 'express';
import * as C from '../controllers/userController.js';

const router = Router();

router.get('/', C.list);
router.post('/', C.validators.validateBody, C.createUser);
router.post('/login', C.validators.validateLoginBody, C.login);
router.get('/:id', C.validators.validateId, C.get);
router.put('/:id', C.validators.validateId, C.validators.validateBody, C.updateUser);
router.delete('/:id', C.validators.validateId, C.deleteUser);

export default router;
