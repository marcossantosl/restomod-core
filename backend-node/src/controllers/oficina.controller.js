const createCrudController = require('../utils/controllerFactory');
const oficinaService = require('../services/oficina.service');
const { createSchema, updateSchema } = require('../validators/oficina.validator');

module.exports = createCrudController(oficinaService, { createSchema, updateSchema });
