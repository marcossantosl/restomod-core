const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

module.exports = createCrudService(prisma.peca, 'idPeca', {
  include: { fornecedores: { include: { fornecedor: true } } },
  nomeNaoEncontrado: 'Peça não encontrada',
  // Achata a tabela associativa "fornece" para uma lista simples de
  // fornecedores, igual ao contrato do backend Go (consumido pelo frontend).
  transform: (peca) => ({
    ...peca,
    fornecedores: peca.fornecedores?.map((fp) => fp.fornecedor) ?? [],
  }),
});
