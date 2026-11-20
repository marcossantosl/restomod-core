const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.cliente, 'idCliente', {
  nomeNaoEncontrado: 'Cliente não encontrado',
});
