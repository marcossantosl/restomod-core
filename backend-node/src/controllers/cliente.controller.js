const createCrudController = require('../utils/controllerFactory');
const clienteService = require('../services/cliente.service');
const { createSchema, updateSchema } = require('../validators/cliente.validator');

module.exports = createCrudController(clienteService, { createSchema, updateSchema });
