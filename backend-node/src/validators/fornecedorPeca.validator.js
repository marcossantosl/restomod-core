const { z } = require('zod');

const createSchema = z.object({
  idPeca: z.number().int().positive('idPeca é obrigatório'),
  idFornecedor: z.number().int().positive('idFornecedor é obrigatório'),
});

module.exports = { createSchema };
