const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.usoPeca, 'idUsoPeca', {
  include: { peca: true, servico: true },
  nomeNaoEncontrado: 'Uso de peça não encontrado',
});
