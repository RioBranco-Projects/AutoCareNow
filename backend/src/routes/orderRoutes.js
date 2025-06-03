
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
<<<<<<< HEAD

// Todas as rotas de /orders exigem autenticação
router.use(authMiddleware);

router.get('/', listOrders);
router.post('/', createOrder);

router.get('/:id', validateId, getOrder);
router.put('/:id', validateId, updateOrder);
router.delete('/:id', validateId, deleteOrder);
=======

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Lista todos os pedidos
 *     description: Retorna uma lista com todos os pedidos cadastrados.
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                         quantity:
 *                           type: integer
 */
router.get('/', C.listOrders);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Cria um novo pedido
 *     description: Cria um pedido para um usuário.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - items
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 647e1c3f7a34f8d2a1234567
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 647e1c3f7a34f8d2a1234568
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', C.createOrder);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     description: Retorna os dados de um pedido específico.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       quantity:
 *                         type: integer
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', C.validators.validateId, C.getOrder);

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Atualiza um pedido pelo ID
 *     description: Atualiza os dados de um pedido específico.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', C.validators.validateId, C.updateOrder);

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Remove um pedido pelo ID
 *     description: Deleta um pedido específico pelo seu ID.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', C.validators.validateId, C.deleteOrder);
>>>>>>> origin/master

export default router;
