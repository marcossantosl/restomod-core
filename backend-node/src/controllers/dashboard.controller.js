const asyncHandler = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard.service');

const servicosPorOficina = asyncHandler(async (req, res) => {
  res.status(200).json(await dashboardService.servicosPorOficina());
});

const horasPorMecanico = asyncHandler(async (req, res) => {
  res.status(200).json(await dashboardService.horasPorMecanico());
});

const pecasUtilizadas = asyncHandler(async (req, res) => {
  res.status(200).json(await dashboardService.pecasUtilizadas());
});

module.exports = { servicosPorOficina, horasPorMecanico, pecasUtilizadas };
