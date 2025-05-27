import { ObjectId } from 'mongodb';
import getDb from '../config/db.js';

const COLLECTION = 'orders';
const STATUSES   = ['pending','in_progress','completed','delivered'];

export function validStatuses() {
  return STATUSES;
}

function serialize(doc) {
  return {
    _id:        doc._id.toString(),
    customerName: doc.customerName,
    vehicle:      doc.vehicle,
    services:     doc.services,
    status:       doc.status,
    createdAt:    doc.createdAt.toISOString(),   // string ISO
    updatedAt:    doc.updatedAt.toISOString(),   // string ISO
  };
}

export async function findAll() {
  const db   = await getDb();
  const docs = await db.collection(COLLECTION).find().toArray();
  return docs.map(serialize);
}

export async function findById(id) {
  const db  = await getDb();
  const doc = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return doc ? serialize(doc) : null;
}

export async function create(data) {
  const db = await getDb();
  const now = new Date();
  const initialStatus = STATUSES.includes(data.status)
    ? data.status
    : 'pending';

  const payload = {
    customerName: data.customerName,
    vehicle:      data.vehicle,
    services:     data.services,
    status:       initialStatus,
    createdAt:    now,
    updatedAt:    now,
  };
  const { insertedId } = await db.collection(COLLECTION).insertOne(payload);
  return serialize({ _id: insertedId, ...payload });
}

export async function update(id, data) {
  const db     = await getDb();
  const updatedAt = new Date();
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...data, updatedAt } }
  );
  return findById(id);
}

export async function remove(id) {
  const db = await getDb();
  return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}


