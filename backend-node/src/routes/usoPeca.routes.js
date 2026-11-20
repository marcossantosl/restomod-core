const createCrudRouter = require('../utils/routerFactory');
const usoPecaController = require('../controllers/usoPeca.controller');

module.exports = createCrudRouter(usoPecaController, { protegerEscrita: true });
