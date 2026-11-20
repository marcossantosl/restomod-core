const { z } = require('zod');

const createSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  especialidade: z.string().trim().max(255).optional(),
  contato: z.string().trim().max(255).optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
