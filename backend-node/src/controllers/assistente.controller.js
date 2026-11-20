const asyncHandler = require('../utils/asyncHandler');
const assistenteService = require('../services/assistente.service');

const contexto = asyncHandler(async (req, res) => {
  res.status(200).json(await assistenteService.contexto());
});

module.exports = { contexto };
