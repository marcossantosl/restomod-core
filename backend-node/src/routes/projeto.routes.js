const createCrudRouter = require('../utils/routerFactory');
const projetoController = require('../controllers/projeto.controller');

// Entidade principal: criação/atualização/remoção exigem JWT válido.
module.exports = createCrudRouter(projetoController, { protegerEscrita: true });
