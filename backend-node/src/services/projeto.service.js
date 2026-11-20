const prisma = require('../database/prisma');
const createCrudService = require('../utils/crudFactory');

// Entidade principal do domínio: o projeto de restomod, ligado a
// Cliente, Oficina e Veículo (entidades relacionadas).
module.exports = createCrudService(prisma.projeto, 'idProjeto', {
  include: { cliente: true, oficina: true, veiculo: true },
  nomeNaoEncontrado: 'Projeto não encontrado',
});
