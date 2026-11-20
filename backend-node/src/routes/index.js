const express = require('express');

const authRoutes = require('./auth.routes');
const clienteRoutes = require('./cliente.routes');
const projetoRoutes = require('./projeto.routes');
const veiculoRoutes = require('./veiculo.routes');
const mecanicoRoutes = require('./mecanico.routes');
const pecaRoutes = require('./peca.routes');
const usoPecaRoutes = require('./usoPeca.routes');
const servicoRoutes = require('./servico.routes');
const fornecedorRoutes = require('./fornecedor.routes');
const fornecedorPecaRoutes = require('./fornecedorPeca.routes');
const historicoProjetoRoutes = require('./historicoProjeto.routes');
const inspecaoRoutes = require('./inspecao.routes');
const mecanicoServicoRoutes = require('./mecanicoServico.routes');
const oficinaRoutes = require('./oficina.routes');
const upgradeRestomodRoutes = require('./upgradeRestomod.routes');
const dashboardRoutes = require('./dashboard.routes');
const assistenteController = require('../controllers/assistente.controller');
const seedController = require('../controllers/seed.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/clientes', clienteRoutes);
router.use('/projetos', projetoRoutes);
router.use('/veiculos', veiculoRoutes);
router.use('/mecanicos', mecanicoRoutes);
router.use('/pecas', pecaRoutes);
router.use('/usopeca', usoPecaRoutes);
router.use('/servicos', servicoRoutes);
router.use('/fornecedor', fornecedorRoutes);
router.use('/fornecedorpeca', fornecedorPecaRoutes);
router.use('/historicoprojeto', historicoProjetoRoutes);
router.use('/inspecao', inspecaoRoutes);
router.use('/mecanicoservico', mecanicoServicoRoutes);
router.use('/oficinas', oficinaRoutes);
router.use('/upgraderestomod', upgradeRestomodRoutes);
router.use('/dashboard', dashboardRoutes);

router.get('/assistente/contexto', assistenteController.contexto);
// Popular e apagar o banco são operações destrutivas: exigem JWT.
router.post('/seed', authMiddleware, seedController.seed);
router.delete('/drop', authMiddleware, seedController.drop);

module.exports = router;
