const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.veiculo, 'idVeiculo', {
  include: { cliente: true },
  nomeNaoEncontrado: 'Veículo não encontrado',
});
