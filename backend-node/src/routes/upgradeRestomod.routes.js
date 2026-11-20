const createCrudRouter = require('../utils/routerFactory');
const upgradeRestomodController = require('../controllers/upgradeRestomod.controller');

module.exports = createCrudRouter(upgradeRestomodController, { protegerEscrita: true });
