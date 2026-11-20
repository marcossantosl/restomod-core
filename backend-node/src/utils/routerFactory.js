const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');

// Fábrica de rotas CRUD genérico. `protegerEscrita` define se POST/PUT/DELETE
// exigem JWT válido (usado hoje apenas pela entidade principal, Projeto).
function createCrudRouter(controller, { protegerEscrita = false } = {}) {
  const router = express.Router();
  const guard = protegerEscrita ? [authMiddleware] : [];

  router.get('/', controller.listar);
  router.get('/:id', controller.buscarPorId);
  router.post('/', ...guard, controller.criar);
  router.put('/:id', ...guard, controller.atualizar);
  router.delete('/:id', ...guard, controller.remover);

  return router;
}

module.exports = createCrudRouter;
