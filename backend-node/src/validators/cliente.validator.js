const { z } = require('zod');

const createSchema = z.object({
  nome: z.string().trim().min(1, 'Nome é obrigatório'),
  cpf: z.string().trim().max(20).optional(),
  email: z.string().trim().email('E-mail inválido').max(255).optional(),
  endereco: z.string().trim().max(100).optional(),
  telefone: z.string().trim().max(20).optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
