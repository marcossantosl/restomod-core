const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.mecanico, 'idMecanico', {
  include: { oficina: true },
  nomeNaoEncontrado: 'Mecânico não encontrado',
});
