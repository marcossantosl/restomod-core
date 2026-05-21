package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

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
