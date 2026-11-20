const prisma = require('../database/prisma');

const include = { peca: true, fornecedor: true };

async function listar() {
  return prisma.fornecedorPeca.findMany({ include });
}

async function criar({ idPeca, idFornecedor }) {
  return prisma.fornecedorPeca.create({ data: { idPeca, idFornecedor }, include });
}

async function remover({ idPeca, idFornecedor }) {
  await prisma.fornecedorPeca.deleteMany({
    where: { idPeca: Number(idPeca), idFornecedor: Number(idFornecedor) },
  });
}

async function limparPorPeca(idPeca) {
  await prisma.fornecedorPeca.deleteMany({ where: { idPeca: Number(idPeca) } });
}

module.exports = { listar, criar, remover, limparPorPeca };
