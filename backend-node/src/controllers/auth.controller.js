const authService = require('../services/auth.service');
const { registrarSchema, loginSchema } = require('../validators/auth.validator');
const asyncHandler = require('../utils/asyncHandler');

const registrar = asyncHandler(async (req, res) => {
  const dados = registrarSchema.parse(req.body);
  const usuario = await authService.registrar(dados);
  res.status(201).json(usuario);
});

const login = asyncHandler(async (req, res) => {
  const dados = loginSchema.parse(req.body);
  const resultado = await authService.login(dados);
  res.status(200).json(resultado);
});

module.exports = { registrar, login };
