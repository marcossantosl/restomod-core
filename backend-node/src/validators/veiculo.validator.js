const { z } = require('zod');

const createSchema = z.object({
  marca: z.string().trim().max(100).optional(),
  modelo: z.string().trim().max(100).optional(),
  placa: z.string().trim().max(20).optional(),
  chassi: z.string().trim().max(100).optional(),
  anoFabricacao: z.number().int().min(1900).max(2100).optional(),
  status: z.string().trim().max(50).optional(),
  categoria: z.string().trim().max(100).optional(),
  whpOriginal: z.number().int().optional(),
  kgfmOriginal: z.number().int().optional(),
  idCliente: z.number().int().positive().optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
