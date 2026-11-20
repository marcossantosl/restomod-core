const express = require('express');
const controller = require('../controllers/dashboard.controller');

const router = express.Router();

router.get('/servicos-por-oficina', controller.servicosPorOficina);
router.get('/horas-por-mecanico', controller.horasPorMecanico);
router.get('/pecas-utilizadas', controller.pecasUtilizadas);

module.exports = router;
