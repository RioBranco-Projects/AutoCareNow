
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import {
  registerUser,
  loginUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

<<<<<<< HEAD
// POST /users/register — cria cliente
router.post(
  '/register',
  body('name').notEmpty().withMessage('Name é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password precisa ter pelo menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return registerUser(req, res, next);
  }
);

// POST /users/login — faz login (client ou employee)
router.post(
  '/login',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Password é obrigatório'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return loginUser(req, res, next);
  }
);

// A partir daqui, todas as rotas exigem autenticação
router.use(authMiddleware);

// GET /users — somente employee
router.get('/', (req, res, next) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Acesso negado.' });
  }
  return listUsers(req, res, next);
});

// GET /users/me — dados do próprio usuário
router.get('/me', (req, res, next) => {
  req.params.id = req.user.id;
  return getUser(req, res, next);
});

// GET /users/:id — employee vê qualquer, client só vê o próprio
router.get('/:id', (req, res, next) => {
  if (req.user.role === 'client' && req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }
  return getUser(req, res, next);
});

// PUT /users/:id — employee pode, client só próprio
router.put(
  '/:id',
  (req, res, next) => {
    if (req.user.role === 'client' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    next();
  },
  (req, res, next) => updateUser(req, res, next)
);

// DELETE /users/:id — employee pode, client só próprio
router.delete(
  '/:id',
  (req, res, next) => {
    if (req.user.role === 'client' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    next();
  },
  (req, res, next) => deleteUser(req, res, next)
);
=======
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login de usuário
 *     description: Autentica um usuário com email e senha.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Email e password são obrigatórios
 *       401:
 *         description: Senha inválida
 *       404:
 *         description: Usuário não encontrado
 */
router.post('/login', C.loginUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Registra um novo usuário na plataforma.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', C.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     description: Retorna uma lista de todos os usuários cadastrados.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */
router.get('/', C.listUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário pelo ID
 *     description: Retorna os dados de um usuário específico pelo seu ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', C.getUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza um usuário pelo ID
 *     description: Atualiza os dados de um usuário específico.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: João Silva
 *               email:
 *                 type: string
 *                 example: joao@example.com
 *               password:
 *                 type: string
 *                 example: novaSenha123
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', C.updateUser);

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Remove um usuário pelo ID
 *     description: Deleta um usuário específico pelo seu ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/delete/:id', C.deleteUser);
>>>>>>> origin/master

export default router;

