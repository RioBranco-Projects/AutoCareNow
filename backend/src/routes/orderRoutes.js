
import { Router } from 'express';
import {
  listOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  validateId,
} from '../controllers/orderController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Todas as rotas de /orders exigem autenticação
router.use(authMiddleware);

router.get('/', listOrders);
router.post('/', createOrder);

router.get('/:id', validateId, getOrder);
router.put('/:id', validateId, updateOrder);
router.delete('/:id', validateId, deleteOrder);

export default router;

