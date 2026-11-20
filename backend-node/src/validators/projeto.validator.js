const { z } = require('zod');

const createSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD').optional(),
  dataPrevisao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD').optional(),
  orcamentoTotal: z.number().nonnegative().optional(),
  categoriaProjeto: z.string().trim().max(100).optional(),
  idOficina: z.number().int().positive().optional(),
  idCliente: z.number().int().positive().optional(),
  idVeiculo: z.number().int().positive().optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
