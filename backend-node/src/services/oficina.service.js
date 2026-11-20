const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.oficina, 'idOficina', {
  nomeNaoEncontrado: 'Oficina não encontrada',
});
