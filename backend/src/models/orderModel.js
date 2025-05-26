import { ObjectId } from 'mongodb';
import getDb from '../config/db.js';

const COLLECTION = 'orders';
const STATUSES = ['pending', 'in_progress', 'completed', 'delivered'];

export function validStatuses() {
  return STATUSES;
}

export async function findAll() {
  const db = await getDb();
  return db.collection(COLLECTION).find().toArray();
}

export async function findById(id) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
}

export async function create(data) {
  const db = await getDb();
  const now = new Date();
  const payload = {
    customerName: data.customerName,
    vehicle: data.vehicle,         // ex: { plate, model }
    services: data.services,       // ex: ['wash', 'wax']
    status: 'pending',             // status inicial
    createdAt: now,
    updatedAt: now
  };
  const { insertedId } = await db.collection(COLLECTION).insertOne(payload);
  return { _id: insertedId, ...payload };
}

export async function update(id, data) {
  const db = await getDb();
  const updatedAt = new Date();
  const payload = { ...data, updatedAt };
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: payload }
  );
  return findById(id);
}

export async function remove(id) {
  const db = await getDb();
  return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
