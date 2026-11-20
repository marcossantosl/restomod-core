const createCrudRouter = require('../utils/routerFactory');
const fornecedorController = require('../controllers/fornecedor.controller');

module.exports = createCrudRouter(fornecedorController, { protegerEscrita: true });
