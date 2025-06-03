
import * as User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'troque_para_variavel_de_ambiente';
const JWT_EXPIRES_IN = '8h';


export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email e password são obrigatórios.',
      });
    }
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email já cadastrado.' });
    }
    const newUser = await User.create({ name, email, password });
    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};


export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email e password são obrigatórios.' });
    }

    if (
      email === 'funcionario@autocarenow.com.br' &&
      password === '123456'
    ) {
      const payload = { userId: 'fixed-employee-id', role: 'employee' };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
      return res.json({
        message: 'Login do funcionário bem-sucedido',
        token,
        user: {
          _id: 'fixed-employee-id',
          name: 'Funcionário Autocare Now',
          email: 'funcionario@autocarenow.com.br',
          role: 'employee',
        },
      });
    }

    // fluxo normal para cliente
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado com esse email.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: 'Senha inválida. Tente novamente.' });
    }

    const payload = { userId: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({
      message: 'Login bem-sucedido',
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role, // sempre "client" aqui
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /users
 * Só employee pode listar todos.
 */
export const listUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /users/:id
 * - employee pode ver qualquer
 * - client só pode ver seu próprio perfil
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    return res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /users/:id
 * - employee pode atualizar qualquer
 * - client só pode atualizar o próprio
 */
export const updateUser = async (req, res, next) => {
  try {
    const updated = await User.update(req.params.id, req.body);
    if (!updated)
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /users/:id
 * - employee pode remover qualquer
 * - client só pode remover o próprio (ou pode não permitir)
 */
export const deleteUser = async (req, res, next) => {
  try {
    const result = await User.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    return res.json({ message: 'Usuário removido com sucesso.' });
  } catch (err) {
    next(err);
  }
};

