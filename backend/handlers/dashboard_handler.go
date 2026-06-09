package handlers

import (
	"projeto-oficina/config"

	"github.com/gin-gonic/gin"
)

// Consulta 1 — Valor total de serviços por oficina
func ConsultaServicosPorOficina(c *gin.Context) {
	type Resultado struct {
		Oficina       string  `json:"oficina"`
		TotalServicos int     `json:"total_servicos"`
		ValorTotal    float64 `json:"valor_total"`
	}
	var resultados []Resultado
	config.DB.Raw(`
        SELECT o.nome AS oficina,
               COUNT(s.id_servico) AS total_servicos,
               COALESCE(SUM(s.valor), 0) AS valor_total
        FROM oficina o
        JOIN projeto p ON p.id_oficina = o.id_oficina
        JOIN servico s ON s.id_projeto = p.id_projeto
        GROUP BY o.nome
        ORDER BY valor_total DESC
    `).Scan(&resultados)
	c.JSON(200, resultados)
}

// Consulta 2 — Horas por mecânico
func ConsultaHorasPorMecanico(c *gin.Context) {
	type Resultado struct {
		Mecanico      string  `json:"mecanico"`
		Especialidade string  `json:"especialidade"`
		TotalServicos int     `json:"total_servicos"`
		TotalHoras    float64 `json:"total_horas"`
	}
	var resultados []Resultado
	config.DB.Raw(`
        SELECT m.nome AS mecanico,
               m.especialidade,
               COUNT(r.id_servico) AS total_servicos,
               COALESCE(SUM(s.horas_realizadas), 0) AS total_horas
        FROM mecanico m
        JOIN realiza r ON r.id_mecanico = m.id_mecanico
        JOIN servico s ON s.id_servico = r.id_servico
        GROUP BY m.nome, m.especialidade
        ORDER BY total_horas DESC
    `).Scan(&resultados)
	c.JSON(200, resultados)
}

// Consulta 3 — Peças mais utilizadas
func ConsultaPecasUtilizadas(c *gin.Context) {
	type Resultado struct {
		Peca             string  `json:"peca"`
		TipoPeca         string  `json:"tipo_peca"`
		TotalUsado       int     `json:"total_usado"`
		ValorMovimentado float64 `json:"valor_movimentado"`
	}
	var resultados []Resultado
	config.DB.Raw(`
        SELECT p.nome AS peca,
               p.tipo_peca,
               COALESCE(SUM(u.quantidade), 0) AS total_usado,
               COALESCE(SUM(u.quantidade * u.valor_venda), 0) AS valor_movimentado
        FROM peca p
        JOIN uso_peca u ON u.id_peca = p.id_peca
        JOIN servico s ON s.id_servico = u.id_servico
        GROUP BY p.nome, p.tipo_peca
        ORDER BY total_usado DESC
    `).Scan(&resultados)
	c.JSON(200, resultados)
}
