const { z } = require('zod');

const createSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  fabricante: z.string().trim().max(255).optional(),
  origem: z.string().trim().max(100).optional(),
  estoque: z.number().int().nonnegative().optional(),
  numeroPeca: z.number().int().optional(),
  precoReferencia: z.number().nonnegative().optional(),
  tipoPeca: z.string().trim().max(100).optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
