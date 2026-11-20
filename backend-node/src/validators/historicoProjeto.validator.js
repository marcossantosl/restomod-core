const { z } = require('zod');

const createSchema = z.object({
  status: z.string().trim().min(1, 'Status é obrigatório').max(100),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD').optional(),
  kmRegistrado: z.number().int().nonnegative().optional(),
  tipoServico: z.string().trim().max(100).optional(),
  descricao: z.string().trim().max(200).optional(),
  idProjeto: z.number().int().positive('idProjeto é obrigatório'),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
