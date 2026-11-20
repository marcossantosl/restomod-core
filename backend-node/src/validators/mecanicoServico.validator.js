const { z } = require('zod');

const createSchema = z.object({
  idServico: z.number().int().positive('idServico é obrigatório'),
  idMecanico: z.number().int().positive('idMecanico é obrigatório'),
});

module.exports = { createSchema };
