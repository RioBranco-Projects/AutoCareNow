
import * as Order from '../models/orderModel.js';

/**
 * GET /orders
 * - employee vê todas
 * - client vê só as próprias (createdBy === req.user.id)
 */
export async function listOrders(req, res, next) {
  try {
    const allOrders = await Order.findAll();
    if (req.user.role === 'employee') {
      return res.json(allOrders);
    }
    const onlyMine = allOrders.filter(
      (ord) => ord.createdBy === req.user.id
    );
    return res.json(onlyMine);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /orders/:id
 * - employee pode
 * - client só se createdBy === req.user.id
 */
export async function getOrder(req, res, next) {
  try {
    const ord = await Order.findById(req.params.id);
    if (!ord) {
      return res.status(404).json({ message: 'Ordem não encontrada.' });
    }
    if (req.user.role === 'client' && ord.createdBy !== req.user.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    return res.json(ord);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /orders
 * Cria nova ordem com createdBy = req.user.id
 */
export async function createOrder(req, res, next) {
  try {
    const { customerName, vehicle, services, status } = req.body;
    if (!customerName || !vehicle || !services?.length) {
      return res
        .status(400)
        .json({ message: 'Dados insuficientes para criação.' });
    }
    const payload = {
      customerName,
      vehicle,
      services,
      status,
      createdBy: req.user.id,
    };
    const newOrder = await Order.create(payload);
    return res
      .status(201)
      .json({ message: 'Ordem criada com sucesso', order: newOrder });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /orders/:id
 * - employee pode qualquer
 * - client só se createdBy === req.user.id
 */
export async function updateOrder(req, res, next) {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Ordem não encontrada.' });
    }
    if (
      req.user.role === 'client' &&
      existing.createdBy !== req.user.id
    ) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    // Campos permitidos
    const updates = {};
    if (req.body.customerName)
      updates.customerName = req.body.customerName;
    if (req.body.vehicle) updates.vehicle = req.body.vehicle;
    if (req.body.services) updates.services = req.body.services;
    if (req.body.status) updates.status = req.body.status;

    const updated = await Order.update(req.params.id, updates);
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /orders/:id
 * - employee pode qualquer
 * - client só se createdBy === req.user.id
 */
export async function deleteOrder(req, res, next) {
  try {
    const existing = await Order.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Ordem não encontrada.' });
    }
    if (
      req.user.role === 'client' &&
      existing.createdBy !== req.user.id
    ) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const result = await Order.remove(req.params.id);
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: 'Ordem não encontrada para remoção.' });
    }
    return res.json({ message: 'Ordem removida com sucesso.' });
  } catch (err) {
    next(err);
  }
}

/**
 * Funções auxiliares para validações (por ex: validar ObjectId).
 */
import { ObjectId } from 'mongodb';
export function validateId(req, res, next) {
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'ID inválido.' });
  }
  next();
}

