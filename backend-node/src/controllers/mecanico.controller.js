const createCrudController = require('../utils/controllerFactory');
const mecanicoService = require('../services/mecanico.service');
const { createSchema, updateSchema } = require('../validators/mecanico.validator');

module.exports = createCrudController(mecanicoService, { createSchema, updateSchema });
