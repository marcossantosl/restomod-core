const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.upgradeRestomod, 'idUpgradeRestomod', {
  include: { projeto: true },
  nomeNaoEncontrado: 'Upgrade Restomod não encontrado',
});
