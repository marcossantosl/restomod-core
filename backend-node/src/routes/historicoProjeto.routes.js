const createCrudRouter = require('../utils/routerFactory');
const historicoProjetoController = require('../controllers/historicoProjeto.controller');

module.exports = createCrudRouter(historicoProjetoController, { protegerEscrita: true });
