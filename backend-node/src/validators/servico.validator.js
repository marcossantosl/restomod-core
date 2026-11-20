const { z } = require('zod');

const createSchema = z.object({
  categoria: z.string().trim().max(100).optional(),
  descricao: z.string().trim().min(1, 'Descrição é obrigatória').max(200),
  horasEstimadas: z.number().nonnegative().optional(),
  horasRealizadas: z.number().nonnegative().optional(),
  valor: z.number().nonnegative().optional(),
  idProjeto: z.number().int().positive('idProjeto é obrigatório'),
  idUpgradeRestomod: z.number().int().positive().optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
