package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

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
