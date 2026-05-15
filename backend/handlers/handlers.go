package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// ─── PROJETO ─────────────────────────────────────────────────────

func ListarProjetos(c *gin.Context) {
	var projetos []models.Projeto
	config.DB.Preload("Cliente").Preload("Oficina").Find(&projetos)
	c.JSON(http.StatusOK, projetos)
}

func BuscarProjeto(c *gin.Context) {
	var projeto models.Projeto
	if err := config.DB.Preload("Cliente").Preload("Oficina").First(&projeto, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Projeto não encontrado"})
		return
	}
	c.JSON(http.StatusOK, projeto)
}

func CriarProjeto(c *gin.Context) {
	var projeto models.Projeto
	if err := c.ShouldBindJSON(&projeto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&projeto)
	c.JSON(http.StatusCreated, projeto)
}

func AtualizarProjeto(c *gin.Context) {
	var projeto models.Projeto
	if err := config.DB.First(&projeto, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Projeto não encontrado"})
		return
	}
	c.ShouldBindJSON(&projeto)
	config.DB.Save(&projeto)
	c.JSON(http.StatusOK, projeto)
}

func DeletarProjeto(c *gin.Context) {
	config.DB.Delete(&models.Projeto{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"mensagem": "Projeto deletado"})
}

// ─── VEÍCULO ─────────────────────────────────────────────────────

func ListarVeiculos(c *gin.Context) {
	var veiculos []models.Veiculo
	config.DB.Find(&veiculos)
	c.JSON(http.StatusOK, veiculos)
}

func BuscarVeiculo(c *gin.Context) {
	var veiculo models.Veiculo
	if err := config.DB.First(&veiculo, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Veículo não encontrado"})
		return
	}
	c.JSON(http.StatusOK, veiculo)
}

func CriarVeiculo(c *gin.Context) {
	var veiculo models.Veiculo
	if err := c.ShouldBindJSON(&veiculo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&veiculo)
	c.JSON(http.StatusCreated, veiculo)
}

func AtualizarVeiculo(c *gin.Context) {
	var veiculo models.Veiculo
	if err := config.DB.First(&veiculo, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Veículo não encontrado"})
		return
	}
	c.ShouldBindJSON(&veiculo)
	config.DB.Save(&veiculo)
	c.JSON(http.StatusOK, veiculo)
}

func DeletarVeiculo(c *gin.Context) {
	config.DB.Delete(&models.Veiculo{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"mensagem": "Veículo deletado"})
}

// ─── MECÂNICO ────────────────────────────────────────────────────

func ListarMecanicos(c *gin.Context) {
	var mecanicos []models.Mecanico
	config.DB.Preload("Oficina").Find(&mecanicos)
	c.JSON(http.StatusOK, mecanicos)
}

func BuscarMecanico(c *gin.Context) {
	var mecanico models.Mecanico
	if err := config.DB.Preload("Oficina").First(&mecanico, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Mecânico não encontrado"})
		return
	}
	c.JSON(http.StatusOK, mecanico)
}

func CriarMecanico(c *gin.Context) {
	var mecanico models.Mecanico
	if err := c.ShouldBindJSON(&mecanico); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&mecanico)
	c.JSON(http.StatusCreated, mecanico)
}

func AtualizarMecanico(c *gin.Context) {
	var mecanico models.Mecanico
	if err := config.DB.First(&mecanico, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Mecânico não encontrado"})
		return
	}
	c.ShouldBindJSON(&mecanico)
	config.DB.Save(&mecanico)
	c.JSON(http.StatusOK, mecanico)
}

func DeletarMecanico(c *gin.Context) {
	config.DB.Delete(&models.Mecanico{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"mensagem": "Mecânico deletado"})
}

// ─── PEÇA ────────────────────────────────────────────────────────

func ListarPecas(c *gin.Context) {
	var pecas []models.Peca
	config.DB.Find(&pecas)
	c.JSON(http.StatusOK, pecas)
}

func BuscarPeca(c *gin.Context) {
	var peca models.Peca
	if err := config.DB.First(&peca, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Peça não encontrada"})
		return
	}
	c.JSON(http.StatusOK, peca)
}

func CriarPeca(c *gin.Context) {
	var peca models.Peca
	if err := c.ShouldBindJSON(&peca); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&peca)
	c.JSON(http.StatusCreated, peca)
}

func AtualizarPeca(c *gin.Context) {
	var peca models.Peca
	if err := config.DB.First(&peca, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Peça não encontrada"})
		return
	}
	c.ShouldBindJSON(&peca)
	config.DB.Save(&peca)
	c.JSON(http.StatusOK, peca)
}

func DeletarPeca(c *gin.Context) {
	config.DB.Delete(&models.Peca{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"mensagem": "Peça deletada"})
}

// ─── SERVIÇO ─────────────────────────────────────────────────────

func ListarServicos(c *gin.Context) {
	var servicos []models.Servico
	config.DB.Preload("Projeto").Find(&servicos)
	c.JSON(http.StatusOK, servicos)
}

func BuscarServico(c *gin.Context) {
	var servico models.Servico
	if err := config.DB.Preload("Projeto").First(&servico, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Serviço não encontrado"})
		return
	}
	c.JSON(http.StatusOK, servico)
}

func CriarServico(c *gin.Context) {
	var servico models.Servico
	if err := c.ShouldBindJSON(&servico); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&servico)
	c.JSON(http.StatusCreated, servico)
}

func AtualizarServico(c *gin.Context) {
	var servico models.Servico
	if err := config.DB.First(&servico, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Serviço não encontrado"})
		return
	}
	c.ShouldBindJSON(&servico)
	config.DB.Save(&servico)
	c.JSON(http.StatusOK, servico)
}

func DeletarServico(c *gin.Context) {
	config.DB.Delete(&models.Servico{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"mensagem": "Serviço deletado"})
}
