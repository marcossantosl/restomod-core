const { z } = require('zod');
const { campoData } = require('./campos');

const createSchema = z.object({
  titulo: z.string().trim().min(1, 'Título é obrigatório'),
  dataInicio: campoData.optional(),
  dataPrevisao: campoData.optional(),
  orcamentoTotal: z.number().nonnegative().optional(),
  categoriaProjeto: z.string().trim().max(100).optional(),
  idOficina: z.number().int().positive().optional(),
  idCliente: z.number().int().positive().optional(),
  idVeiculo: z.number().int().positive().optional(),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
