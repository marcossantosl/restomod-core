const { z } = require('zod');

const createSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  cnpj: z.string().trim().max(20).optional(),
  especialidade: z.string().trim().max(255).optional(),
  endereco: z.string().trim().max(100).optional(),
  telefone: z.string().trim().max(20).optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
