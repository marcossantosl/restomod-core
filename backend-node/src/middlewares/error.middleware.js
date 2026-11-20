const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');
const ApiError = require('../utils/ApiError');

// Middleware centralizado de erros — última camada antes da resposta.
// Nunca expõe stack trace, segredos ou detalhes internos ao cliente.
function errorMiddleware(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      erro: 'Dados inválidos',
      detalhes: err.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      })),
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.status).json({ erro: err.message });
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ erro: 'Já existe um registro com esse valor único' });
    }
    if (err.code === 'P2003') {
      return res.status(400).json({ erro: 'Referência inválida: o registro relacionado não existe' });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
  }

  console.error(err);
  return res.status(500).json({ erro: 'Erro interno do servidor' });
}

module.exports = errorMiddleware;
