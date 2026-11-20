const { z } = require('zod');
const { campoData } = require('./campos');

const createSchema = z.object({
  dataInspecao: campoData.optional(),
  tipo: z.string().trim().min(1, 'Tipo é obrigatório').max(100),
  resultado: z.string().trim().max(255).optional(),
  observacoes: z.string().trim().max(200).optional(),
  idMecanico: z.number().int().positive('idMecanico é obrigatório'),
  idVeiculo: z.number().int().positive('idVeiculo é obrigatório'),
});

const updateSchema = createSchema.partial();

module.exports = { createSchema, updateSchema };
