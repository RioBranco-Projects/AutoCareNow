import { ObjectId } from 'mongodb';
import getDb from '../config/db.js';

const COLLECTION = 'orders';
const STATUSES = ['pending', 'in_progress', 'completed', 'delivered', 'cancelled'];

/**
 * Converte documento Mongo em objeto serializado
 */

function serialize(doc) {
  return {
    _id:        doc._id ? doc._id.toString() : null,
    customerName: doc.customerName,
    vehicle:      doc.vehicle,
    services:     doc.services,
    status:       doc.status,
    createdBy:    doc.createdBy ? doc.createdBy.toString() : null,
    createdAt:    doc.createdAt ? doc.createdAt.toISOString() : null,
    updatedAt:    doc.updatedAt ? doc.updatedAt.toISOString() : null,
  };
}

export async function findAll() {
  const db   = await getDb();
  const docs = await db.collection(COLLECTION).find().toArray();
  return docs.map(serialize);
}


/**
 * GET /orders/:id → retorna uma ordem pelo ID
 */
export async function findById(id) {
  const db = await getDb();
  const doc = await db
    .collection(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

/**
 * POST /orders → cria nova ordem. data deve conter createdBy (ObjectId como string).
 */
export async function create(data) {
  const db = await getDb();
  const now = new Date();
  const initialStatus =
    data.status && STATUSES.includes(data.status) ? data.status : 'pending';

  const payload = {
    customerName: data.customerName,
    vehicle:      data.vehicle,
    services:     data.services,
    status:       initialStatus,
    createdBy:    new ObjectId(data.createdBy),
    createdAt:    now,
    updatedAt:    now,
  };

  const { insertedId } = await db.collection(COLLECTION).insertOne(payload);
  return serialize({ _id: insertedId, ...payload });
}

/**
 * PUT /orders/:id → atualiza campos permitidos
 */
export async function update(id, data) {
  const db = await getDb();
  const updatedAt = new Date();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt } }
  );
  return findById(id);
}

/**
 * DELETE /orders/:id → remove uma ordem
 */
export async function remove(id) {
  const db = await getDb();
  return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

