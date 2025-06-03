
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

export default router;

