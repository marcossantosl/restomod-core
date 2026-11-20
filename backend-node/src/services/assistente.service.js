const prisma = require('../database/prisma');
const dashboardService = require('./dashboard.service');

// Agrega todos os dados do banco para o assistente de IA (n8n + Gemini).
// Mantém o mesmo contrato de resposta usado hoje pelo workflow n8n.
async function contexto() {
  const [
    clientes,
    oficinas,
    veiculos,
    projetos,
    mecanicos,
    servicos,
    pecas,
    fornecedores,
    usoPecas,
    historicos,
    upgrades,
    inspecoes,
    servicosPorOficina,
    horasPorMecanico,
    pecasUtilizadas,
  ] = await Promise.all([
    prisma.cliente.findMany(),
    prisma.oficina.findMany(),
    prisma.veiculo.findMany({ include: { cliente: true } }),
    prisma.projeto.findMany({ include: { cliente: true, oficina: true, veiculo: true } }),
    prisma.mecanico.findMany({ include: { oficina: true } }),
    prisma.servico.findMany({
      include: { projeto: true, upgradeRestomod: true, mecanicos: { include: { mecanico: true } } },
    }),
    prisma.peca.findMany({ include: { fornecedores: { include: { fornecedor: true } } } }),
    prisma.fornecedor.findMany(),
    prisma.usoPeca.findMany({ include: { peca: true, servico: true } }),
    prisma.historicoProjeto.findMany({ include: { projeto: true } }),
    prisma.upgradeRestomod.findMany({ include: { projeto: true } }),
    prisma.inspecao.findMany({ include: { veiculo: true, mecanico: true } }),
    dashboardService.servicosPorOficina(),
    dashboardService.horasPorMecanico(),
    dashboardService.pecasUtilizadas(),
  ]);

  return {
    clientes,
    oficinas,
    veiculos,
    projetos,
    mecanicos,
    servicos,
    pecas,
    fornecedores,
    uso_pecas: usoPecas,
    historicos_projeto: historicos,
    upgrades_restomod: upgrades,
    inspecoes,
    analises: {
      servicos_por_oficina: servicosPorOficina,
      horas_por_mecanico: horasPorMecanico,
      pecas_utilizadas: pecasUtilizadas,
    },
  };
}

module.exports = { contexto };
