
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import getDb from '../config/db.js';

const COLLECTION = 'users';
const SALT_ROUNDS = 10;

/**
 * Retorna todos os usuários (omitindo a senha).
 */
export async function findAll() {
  const db = await getDb();
  return db
    .collection(COLLECTION)
    .find({}, { projection: { password: 0 } })
    .toArray();
}

/**
 * Busca um usuário pelo ID (omitindo a senha).
 */
export async function findById(id) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne(
    { _id: new ObjectId(id) },
    { projection: { password: 0 } }
  );
}

/**
 * Busca um usuário pelo e-mail (inclui senha para comparar hash).
 */
export async function findByEmail(email) {
  const db = await getDb();
  return db.collection(COLLECTION).findOne({ email });
}

/**
 * Cria um novo usuário sempre com role = "client".
 */
export async function create(data) {
  const db = await getDb();
  const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const now = new Date();

  const payload = {
    name: data.name,
    email: data.email,
    password: hash,
    role: 'client', // todo novo usuário é client
    createdAt: now,
    updatedAt: now,
  };

  const { insertedId } = await db.collection(COLLECTION).insertOne(payload);
  return {
    _id: insertedId.toString(),
    name: data.name,
    email: data.email,
    role: 'client',
  };
}

/**
 * Atualiza um usuário. Pode alterar name, email, password e role se fornecido.
 */
export async function update(id, data) {
  const db = await getDb();
  const updatePayload = {
    name: data.name,
    email: data.email,
    updatedAt: new Date(),
  };

  if (data.password) {
    updatePayload.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  if (data.role) {
    const validRoles = ['client', 'employee'];
    if (!validRoles.includes(data.role)) {
      throw new Error(`Role inválido. Deve ser ${validRoles.join(', ')}`);
    }
    updatePayload.role = data.role;
  }

  await db.collection(COLLECTION).updateOne(
    { _id: new ObjectId(id) },
    { $set: updatePayload }
  );
  return findById(id);
}

/**
 * Remove um usuário pelo ID.
 */
export async function remove(id) {
  const db = await getDb();
  return db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
}

