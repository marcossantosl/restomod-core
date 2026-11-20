const { z } = require('zod');

const createSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  cpf: z.string().trim().max(20).optional(),
  especialidade: z.string().trim().max(100).optional(),
  nivel: z.string().trim().max(50).optional(),
  idOficina: z.number().int().positive().optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
