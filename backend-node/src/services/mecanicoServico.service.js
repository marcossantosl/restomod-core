const prisma = require('../database/prisma');

const include = { mecanico: true, servico: true };

async function listar() {
  return prisma.mecanicoServico.findMany({ include });
}

async function criar({ idServico, idMecanico }) {
  return prisma.mecanicoServico.create({ data: { idServico, idMecanico }, include });
}

async function remover({ idServico, idMecanico }) {
  await prisma.mecanicoServico.deleteMany({
    where: { idServico: Number(idServico), idMecanico: Number(idMecanico) },
  });
}

async function limparPorServico(idServico) {
  await prisma.mecanicoServico.deleteMany({ where: { idServico: Number(idServico) } });
}

module.exports = { listar, criar, remover, limparPorServico };
