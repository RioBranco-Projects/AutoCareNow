import { Router } from 'express';
import * as C from '../controllers/userController.js';

const router = Router();

router.post('/login', C.loginUser);

router.post('/', C.createUser);
router.get('/', C.listUsers);
router.get('/:id', C.getUser);
router.put('/:id', C.updateUser);
router.delete('/:id', C.deleteUser);

export default router;
