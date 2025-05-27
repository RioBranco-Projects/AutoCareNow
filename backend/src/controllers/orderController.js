import * as Order from '../models/orderModel.js';
import { ObjectId } from 'mongodb';

function validateId(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID inválido' });
  }
  next();
}

export const listOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Ordem não encontrada' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const { customerName, vehicle, services, status } = req.body;
    if (!customerName || !vehicle || !services?.length) {
      return res.status(400).json({ message: 'Dados insuficientes para criação' });
    }
    const newOrder = await Order.create({ customerName, vehicle, services, status });
    res.status(201).json({ message: 'Ordem criada com sucesso' ,order: newOrder});    
  } catch (err) {
    next(err);
  }
};

export const updateOrder = async (req, res, next) => {
  try {
    const exists = await Order.findById(req.params.id);
    if (!exists) return res.status(404).json({ message: 'Ordem não encontrada' });
    const updated = await Order.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const result = await Order.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Ordem não encontrada' });
    }
    res.status(200).json({ message: 'Ordem removida com sucesso' }).end();
  } catch (err) {
    next(err);
  }
};

export const validators = { validateId };
