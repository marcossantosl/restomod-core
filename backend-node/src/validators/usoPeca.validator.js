const { z } = require('zod');

const createSchema = z.object({
  valorVenda: z.number().nonnegative().optional(),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
  idPeca: z.number().int().positive('idPeca é obrigatório'),
  idServico: z.number().int().positive('idServico é obrigatório'),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
