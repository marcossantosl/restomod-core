const createCrudRouter = require('../utils/routerFactory');
const oficinaController = require('../controllers/oficina.controller');

module.exports = createCrudRouter(oficinaController, { protegerEscrita: true });
