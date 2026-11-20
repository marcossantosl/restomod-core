const createCrudController = require('../utils/controllerFactory');
const servicoService = require('../services/servico.service');
const { createSchema, updateSchema } = require('../validators/servico.validator');

module.exports = createCrudController(servicoService, { createSchema, updateSchema });
