const createCrudController = require('../utils/controllerFactory');
const veiculoService = require('../services/veiculo.service');
const { createSchema, updateSchema } = require('../validators/veiculo.validator');

module.exports = createCrudController(veiculoService, { createSchema, updateSchema });
