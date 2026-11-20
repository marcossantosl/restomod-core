const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.inspecao, 'idInspecao', {
  include: { veiculo: true, mecanico: true },
  nomeNaoEncontrado: 'Inspeção não encontrada',
});
