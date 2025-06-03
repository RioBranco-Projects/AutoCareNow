
import jwt from 'jsonwebtoken';
import * as User from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET || 'troque_para_variavel_de_ambiente';

/**
 * Verifica o JWT enviado em Authorization: Bearer <token>.
 * Injeta req.user = { id, role }.
 * Se não houver token ou for inválido, responde 401.
 * Se role=client, confere se usuário existe no banco.
 */
export async function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Token mal formatado.' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded = { userId, role, iat, exp }
    if (decoded.role === 'client') {
      // valida se existe no banco
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Usuário não encontrado.' });
      }
    }
    // injeta req.user
    req.user = { id: decoded.userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

