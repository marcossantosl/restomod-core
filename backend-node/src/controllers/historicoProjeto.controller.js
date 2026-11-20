const createCrudController = require('../utils/controllerFactory');
const historicoProjetoService = require('../services/historicoProjeto.service');
const { createSchema, updateSchema } = require('../validators/historicoProjeto.validator');

module.exports = createCrudController(historicoProjetoService, { createSchema, updateSchema });
