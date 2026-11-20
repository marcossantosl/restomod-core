const createCrudController = require('../utils/controllerFactory');
const pecaService = require('../services/peca.service');
const { createSchema, updateSchema } = require('../validators/peca.validator');

module.exports = createCrudController(pecaService, { createSchema, updateSchema });
