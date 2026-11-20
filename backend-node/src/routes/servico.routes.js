const createCrudRouter = require('../utils/routerFactory');
const servicoController = require('../controllers/servico.controller');

module.exports = createCrudRouter(servicoController, { protegerEscrita: true });
