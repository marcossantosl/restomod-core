const createCrudRouter = require('../utils/routerFactory');
const mecanicoController = require('../controllers/mecanico.controller');

module.exports = createCrudRouter(mecanicoController, { protegerEscrita: true });
