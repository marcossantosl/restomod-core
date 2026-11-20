const { z } = require('zod');
const { DATA_REGEX, paraDate } = require('../utils/datas');

// Campo de data reutilizado pelos validators: aceita "AAAA-MM-DD", rejeita
// datas impossíveis (ex.: 2024-02-31) e entrega ao service um Date, que é o
// tipo que o Prisma espera para colunas DATE.
const campoData = z
  .string()
  .regex(DATA_REGEX, 'Data deve estar no formato AAAA-MM-DD')
  .refine((texto) => paraDate(texto).toISOString().startsWith(texto), 'Data inválida')
  .transform(paraDate);

module.exports = { campoData };
