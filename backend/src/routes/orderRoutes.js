import { Router } from 'express';
import * as C from '../controllers/orderController.js';

const router = Router();

router.get('/', C.listOrders);
router.post('/', C.createOrder);
router.get('/:id',  C.getOrder);
router.put('/:id',  C.updateOrder);
router.delete('/:id',  C.deleteOrder);

export default router;
