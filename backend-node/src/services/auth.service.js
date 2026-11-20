const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../database/prisma');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const SALT_ROUNDS = 10;

async function registrar({ nome, email, senha }) {
  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) {
    throw ApiError.conflict('Já existe um usuário cadastrado com esse e-mail');
  }

  const hash = await bcrypt.hash(senha, SALT_ROUNDS);

  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: hash },
  });

  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

async function login({ email, senha }) {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) {
    throw ApiError.unauthorized('E-mail ou senha inválidos');
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    throw ApiError.unauthorized('E-mail ou senha inválidos');
  }

  const token = jwt.sign({ sub: usuario.id, email: usuario.email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });

  return { token };
}

module.exports = { registrar, login };
