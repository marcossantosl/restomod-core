const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const controller = require('../controllers/fornecedorPeca.controller');

const router = express.Router();

router.get('/', controller.listar);
router.post('/', authMiddleware, controller.criar);
router.delete('/limpar', authMiddleware, controller.limpar);
router.delete('/', authMiddleware, controller.remover);

module.exports = router;
