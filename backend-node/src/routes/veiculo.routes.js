const createCrudRouter = require('../utils/routerFactory');
const veiculoController = require('../controllers/veiculo.controller');

module.exports = createCrudRouter(veiculoController, { protegerEscrita: true });
