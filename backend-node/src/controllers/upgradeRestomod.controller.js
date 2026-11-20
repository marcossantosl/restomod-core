const createCrudController = require('../utils/controllerFactory');
const upgradeRestomodService = require('../services/upgradeRestomod.service');
const { createSchema, updateSchema } = require('../validators/upgradeRestomod.validator');

module.exports = createCrudController(upgradeRestomodService, { createSchema, updateSchema });
