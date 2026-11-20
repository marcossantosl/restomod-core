const createCrudRouter = require('../utils/routerFactory');
const clienteController = require('../controllers/cliente.controller');

module.exports = createCrudRouter(clienteController, { protegerEscrita: true });
