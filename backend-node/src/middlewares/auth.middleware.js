const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

// Protege rotas que exigem um usuário autenticado via "Authorization: Bearer <token>".
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(ApiError.unauthorized('Token não fornecido'));
  }

  const token = header.slice('Bearer '.length).trim();

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.usuario = { id: payload.sub, email: payload.email };
    next();
  } catch (err) {
    return next(ApiError.unauthorized('Token inválido ou expirado'));
  }
}

module.exports = authMiddleware;
