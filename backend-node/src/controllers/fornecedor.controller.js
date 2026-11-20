const createCrudController = require('../utils/controllerFactory');
const fornecedorService = require('../services/fornecedor.service');
const { createSchema, updateSchema } = require('../validators/fornecedor.validator');

module.exports = createCrudController(fornecedorService, { createSchema, updateSchema });
