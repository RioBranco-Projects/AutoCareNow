import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import getDb from '../config/db.js';

const COLLECTION = 'users';
const SALT_ROUNDS = 10;

export async function findAll() {
  const db = await getDb();
  return db.collection(COLLECTION).find({}, { projection: { password: 0 } }).toArray();
}

export async function findById(id) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
}

export async function findByEmail(email) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ email });
}

export async function create(data) {
  const db = await getDb();
  const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const payload = { name: data.name, email: data.email, password: hash };
  const { insertedId } = await db.collection(COLLECTION).insertOne(payload);
  return { _id: insertedId, name: data.name, email: data.email };
}

export async function update(id, data) {
  const db = await getDb();
  const updatePayload = { name: data.name, email: data.email };
  if (data.password) {
    updatePayload.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }
  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: updatePayload }
  );
  return findById(id);
}

export async function remove(id) {
  const db = await getDb();
  return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}
