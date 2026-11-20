const asyncHandler = require('./asyncHandler');

// Fábrica de controller CRUD genérico: recebe req, chama o service, devolve a resposta HTTP.
// Nenhuma regra de negócio ou acesso a banco acontece aqui.
function createCrudController(service, { createSchema, updateSchema }) {
  return {
    listar: asyncHandler(async (req, res) => {
      const registros = await service.listar();
      res.status(200).json(registros);
    }),

    buscarPorId: asyncHandler(async (req, res) => {
      const registro = await service.buscarPorId(req.params.id);
      res.status(200).json(registro);
    }),

    criar: asyncHandler(async (req, res) => {
      const dados = createSchema.parse(req.body);
      const registro = await service.criar(dados);
      res.status(201).json(registro);
    }),

    atualizar: asyncHandler(async (req, res) => {
      const dados = updateSchema.parse(req.body);
      const registro = await service.atualizar(req.params.id, dados);
      res.status(200).json(registro);
    }),

    remover: asyncHandler(async (req, res) => {
      await service.remover(req.params.id);
      res.status(200).json({ mensagem: 'Removido com sucesso' });
    }),
  };
}

module.exports = createCrudController;
