const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/fornecedorPeca.service');
const { createSchema } = require('../validators/fornecedorPeca.validator');

const listar = asyncHandler(async (req, res) => {
  const registros = await service.listar();
  res.status(200).json(registros);
});

const criar = asyncHandler(async (req, res) => {
  const dados = createSchema.parse(req.body);
  const registro = await service.criar(dados);
  res.status(201).json(registro);
});

const remover = asyncHandler(async (req, res) => {
  await service.remover({ idPeca: req.query.id_peca, idFornecedor: req.query.id_fornecedor });
  res.status(200).json({ mensagem: 'Deletado' });
});

const limpar = asyncHandler(async (req, res) => {
  await service.limparPorPeca(req.query.id_peca);
  res.status(200).json({ mensagem: 'Registros antigos limpos com sucesso' });
});

module.exports = { listar, criar, remover, limpar };
