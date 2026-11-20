const ApiError = require('./ApiError');

// Fábrica de service CRUD genérico reutilizada por todas as entidades do domínio
// (routes -> controllers -> services -> Prisma). Cada entidade continua tendo seu
// próprio arquivo de service, que apenas instancia esta fábrica com seu delegate
// Prisma, seu campo de id e, opcionalmente, os relacionamentos a incluir.
function createCrudService(delegate, idField, { include, nomeNaoEncontrado = 'Registro não encontrado', transform } = {}) {
  const aplicar = (registro) => (transform ? transform(registro) : registro);

  return {
    async listar() {
      const registros = await delegate.findMany({ include });
      return registros.map(aplicar);
    },

    async buscarPorId(id) {
      const registro = await delegate.findUnique({
        where: { [idField]: Number(id) },
        include,
      });
      if (!registro) {
        throw ApiError.notFound(nomeNaoEncontrado);
      }
      return aplicar(registro);
    },

    async criar(dados) {
      const registro = await delegate.create({ data: dados, include });
      return aplicar(registro);
    },

    async atualizar(id, dados) {
      await this.buscarPorId(id);
      const registro = await delegate.update({
        where: { [idField]: Number(id) },
        data: dados,
        include,
      });
      return aplicar(registro);
    },

    async remover(id) {
      await this.buscarPorId(id);
      await delegate.delete({ where: { [idField]: Number(id) } });
    },
  };
}

module.exports = createCrudService;
