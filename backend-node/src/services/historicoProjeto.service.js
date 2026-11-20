const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.historicoProjeto, 'idHistorico', {
  include: { projeto: true },
  nomeNaoEncontrado: 'Histórico de projeto não encontrado',
});
