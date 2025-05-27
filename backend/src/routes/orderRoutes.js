import { Router } from 'express';
import * as C from '../controllers/orderController.js';

const router = Router();
router.get('/', C.listOrders);

router.post('/', C.createOrder);

router.get(
  '/:id',
  C.validators.validateId,
  C.getOrder
);

router.put(
  '/:id',
  C.validators.validateId,
  C.updateOrder
);

router.delete(
  '/:id',
  C.validators.validateId,
  C.deleteOrder
);

export default router;

