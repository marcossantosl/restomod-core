const { z } = require('zod');

const createSchema = z.object({
  dataInspecao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato AAAA-MM-DD').optional(),
  tipo: z.string().trim().min(1, 'Tipo é obrigatório').max(100),
  resultado: z.string().trim().max(255).optional(),
  observacoes: z.string().trim().max(200).optional(),
  idMecanico: z.number().int().positive('idMecanico é obrigatório'),
  idVeiculo: z.number().int().positive('idVeiculo é obrigatório'),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
