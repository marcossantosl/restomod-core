const createCrudController = require('../utils/controllerFactory');
const projetoService = require('../services/projeto.service');
const { createSchema, updateSchema } = require('../validators/projeto.validator');

module.exports = createCrudController(projetoService, { createSchema, updateSchema });
