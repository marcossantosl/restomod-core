const createCrudRouter = require('../utils/routerFactory');
const pecaController = require('../controllers/peca.controller');

module.exports = createCrudRouter(pecaController, { protegerEscrita: true });
