const createCrudController = require('../utils/controllerFactory');
const inspecaoService = require('../services/inspecao.service');
const { createSchema, updateSchema } = require('../validators/inspecao.validator');

module.exports = createCrudController(inspecaoService, { createSchema, updateSchema });
