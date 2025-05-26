import * as User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// Validadores
function validateId(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  next();
}

function validateBody(req, res, next) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email e password são obrigatórios' });
  }
  next();
}

function validateLoginBody(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password são obrigatórios' });
  }
  next();
}

// Ações
export const list = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const get = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Não encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const exists = await User.findById(req.params.id);
    if (!exists) return res.status(404).json({ message: 'Não encontrado' });
    const updated = await User.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await User.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Não encontrado' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(401).json({ message: 'Credenciais inválidas' });
    res.json({ message: 'Login bem-sucedido', user: { _id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    next(err);
  }
};

export const validators = { validateId, validateBody, validateLoginBody };
