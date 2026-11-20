const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.servico, 'idServico', {
  include: {
    projeto: true,
    upgradeRestomod: true,
    mecanicos: { include: { mecanico: true } },
  },
  nomeNaoEncontrado: 'Serviço não encontrado',
  // Achata a tabela associativa "realiza" para uma lista simples de
  // mecânicos, igual ao contrato do backend Go (consumido pelo frontend).
  transform: (servico) => ({
    ...servico,
    mecanicos: servico.mecanicos?.map((ms) => ms.mecanico) ?? [],
  }),
});
