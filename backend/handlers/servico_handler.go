package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

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
