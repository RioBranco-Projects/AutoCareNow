import * as User from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email e password são obrigatórios' });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ message: 'Usuário não encontrado com esse e-mail' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ message: 'Senha inválida. Tente novamente.' });
    }
    return res.json({
      message: 'Login bem-sucedido',
      user: { _id: user._id, name: user.name, email: user.email }
    });
    console.log('login body', req.body);
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
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
    const updatedUser = await User.update(req.params.id, req.body);
    if (!updatedUser) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const result = await User.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    res.status(200).json({ message: 'Usuário removido com sucesso' }).end();
  } catch (err) {
    next(err);
  }
};

