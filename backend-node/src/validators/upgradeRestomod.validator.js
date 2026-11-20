const { z } = require('zod');
const { campoData } = require('./campos');

const createSchema = z.object({
  sistemaAlvo: z.string().trim().min(1, 'Sistema alvo é obrigatório').max(255),
  veiculoDoador: z.string().trim().max(255).optional(),
  descricaoAdaptacao: z.string().trim().max(255).optional(),
  whpFinal: z.number().int().optional(),
  kgfmFinal: z.number().int().optional(),
  dataUpgradeInicio: campoData.optional(),
  dataUpgradeFim: campoData.optional(),
  idProjeto: z.number().int().positive('idProjeto é obrigatório'),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
