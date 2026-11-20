const createCrudController = require('../utils/controllerFactory');
const usoPecaService = require('../services/usoPeca.service');
const { createSchema, updateSchema } = require('../validators/usoPeca.validator');

module.exports = createCrudController(usoPecaService, { createSchema, updateSchema });
