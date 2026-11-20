const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.fornecedor, 'idFornecedor', {
  nomeNaoEncontrado: 'Fornecedor não encontrado',
});
