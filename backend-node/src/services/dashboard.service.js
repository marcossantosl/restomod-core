const prisma = require('../database/prisma');

async function servicosPorOficina() {
  return prisma.$queryRaw`
    SELECT o.nome AS oficina,
           COUNT(s.id_servico)::int AS total_servicos,
           COALESCE(SUM(s.valor), 0)::float8 AS valor_total
    FROM oficina o
    JOIN projeto p ON p.id_oficina = o.id_oficina
    JOIN servico s ON s.id_projeto = p.id_projeto
    GROUP BY o.nome
    ORDER BY valor_total DESC
  `;
}

async function horasPorMecanico() {
  return prisma.$queryRaw`
    SELECT m.nome AS mecanico,
           m.especialidade,
           COUNT(r.id_servico)::int AS total_servicos,
           COALESCE(SUM(s.horas_realizadas), 0)::float8 AS total_horas
    FROM mecanico m
    JOIN realiza r ON r.id_mecanico = m.id_mecanico
    JOIN servico s ON s.id_servico = r.id_servico
    GROUP BY m.nome, m.especialidade
    ORDER BY total_horas DESC
  `;
}

async function pecasUtilizadas() {
  return prisma.$queryRaw`
    SELECT p.nome AS peca,
           p.tipo_peca,
           COALESCE(SUM(u.quantidade), 0)::int AS total_usado,
           COALESCE(SUM(u.quantidade * u.valor_venda), 0)::float8 AS valor_movimentado
    FROM peca p
    JOIN uso_peca u ON u.id_peca = p.id_peca
    JOIN servico s ON s.id_servico = u.id_servico
    GROUP BY p.nome, p.tipo_peca
    ORDER BY total_usado DESC
  `;
}

module.exports = { servicosPorOficina, horasPorMecanico, pecasUtilizadas };
