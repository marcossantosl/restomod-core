package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// ContextoAssistente agrega todos os dados do banco para o assistente IA (n8n + Gemini).
func ContextoAssistente(c *gin.Context) {
	var clientes []models.Cliente
	var oficinas []models.Oficina
	var veiculos []models.Veiculo
	var projetos []models.Projeto
	var mecanicos []models.Mecanico
	var servicos []models.Servico
	var pecas []models.Peca
	var fornecedores []models.Fornecedor
	var usoPecas []models.UsoPeca
	var historicos []models.HistoricoProjeto
	var upgrades []models.UpgradeRestomod
	var inspecoes []models.Inspecao

	config.DB.Find(&clientes)
	config.DB.Find(&oficinas)
	config.DB.Preload("Cliente").Find(&veiculos)
	config.DB.Preload("Cliente").Preload("Oficina").Preload("Veiculo").Find(&projetos)
	config.DB.Preload("Oficina").Find(&mecanicos)
	config.DB.Preload("Projeto").Preload("Mecanicos").Preload("UpgradeRestomod").Find(&servicos)
	config.DB.Preload("Fornecedores").Find(&pecas)
	config.DB.Find(&fornecedores)
	config.DB.Preload("Peca").Preload("Servico").Find(&usoPecas)
	config.DB.Preload("Projeto").Find(&historicos)
	config.DB.Preload("Projeto").Find(&upgrades)
	config.DB.Preload("Veiculo").Preload("Mecanico").Find(&inspecoes)

	type ServicosPorOficina struct {
		Oficina       string  `json:"oficina"`
		TotalServicos int     `json:"total_servicos"`
		ValorTotal    float64 `json:"valor_total"`
	}
	type HorasPorMecanico struct {
		Mecanico      string  `json:"mecanico"`
		Especialidade string  `json:"especialidade"`
		TotalServicos int     `json:"total_servicos"`
		TotalHoras    float64 `json:"total_horas"`
	}
	type PecasUtilizadas struct {
		Peca             string  `json:"peca"`
		TipoPeca         string  `json:"tipo_peca"`
		TotalUsado       int     `json:"total_usado"`
		ValorMovimentado float64 `json:"valor_movimentado"`
	}

	var servicosPorOficina []ServicosPorOficina
	var horasPorMecanico []HorasPorMecanico
	var pecasUtilizadas []PecasUtilizadas

	config.DB.Raw(`
		SELECT o.nome AS oficina,
		       COUNT(s.id_servico) AS total_servicos,
		       COALESCE(SUM(s.valor), 0) AS valor_total
		FROM oficina o
		JOIN projeto p ON p.id_oficina = o.id_oficina
		JOIN servico s ON s.id_projeto = p.id_projeto
		GROUP BY o.nome
		ORDER BY valor_total DESC
	`).Scan(&servicosPorOficina)

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
	`).Scan(&horasPorMecanico)

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
	`).Scan(&pecasUtilizadas)

	c.JSON(200, gin.H{
		"clientes":            clientes,
		"oficinas":            oficinas,
		"veiculos":            veiculos,
		"projetos":            projetos,
		"mecanicos":           mecanicos,
		"servicos":            servicos,
		"pecas":               pecas,
		"fornecedores":        fornecedores,
		"uso_pecas":           usoPecas,
		"historicos_projeto":  historicos,
		"upgrades_restomod":   upgrades,
		"inspecoes":           inspecoes,
		"analises": gin.H{
			"servicos_por_oficina": servicosPorOficina,
			"horas_por_mecanico":   horasPorMecanico,
			"pecas_utilizadas":     pecasUtilizadas,
		},
	})
}
