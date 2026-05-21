package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

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
