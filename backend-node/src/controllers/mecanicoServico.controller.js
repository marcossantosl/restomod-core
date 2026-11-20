const asyncHandler = require('../utils/asyncHandler');
const service = require('../services/mecanicoServico.service');
const { createSchema } = require('../validators/mecanicoServico.validator');

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
  await service.remover({ idServico: req.query.id_servico, idMecanico: req.query.id_mecanico });
  res.status(200).json({ mensagem: 'deletado' });
});

const limpar = asyncHandler(async (req, res) => {
  await service.limparPorServico(req.query.id_servico);
  res.status(200).json({ mensagem: 'Registros antigos limpos com sucesso' });
});

module.exports = { listar, criar, remover, limpar };
