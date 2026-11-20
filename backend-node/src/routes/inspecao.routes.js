const createCrudRouter = require('../utils/routerFactory');
const inspecaoController = require('../controllers/inspecao.controller');

module.exports = createCrudRouter(inspecaoController, { protegerEscrita: true });
