const asyncHandler = require('../utils/asyncHandler');
const seedService = require('../services/seed.service');

const seed = asyncHandler(async (req, res) => {
  await seedService.popular();
  res.status(200).json({ mensagem: 'Banco populado com sucesso!' });
});

const drop = asyncHandler(async (req, res) => {
  await seedService.limpar();
  res.status(200).json({ mensagem: 'Todas as tabelas foram limpas!' });
});

module.exports = { seed, drop };
