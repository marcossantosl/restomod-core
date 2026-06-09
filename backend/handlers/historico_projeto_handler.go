package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// ─── HISTÓRICO DO PROJETO ────────────────────────────────────────

// GET /api/historicoprojeto
func ListarHistoricoProjeto(c *gin.Context) {
	var historicos []models.HistoricoProjeto

	if err := config.DB.Preload("Projeto").Find(&historicos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao listar históricos: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, historicos)
}

// GET /api/historicoprojeto/:id
func BuscarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := config.DB.Preload("Projeto.Veiculo").First(&historicoprojeto, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(http.StatusOK, historicoprojeto)
}

// POST /api/historicoprojeto
func CriarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := c.ShouldBindJSON(&historicoprojeto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Omit("Projeto").Create(&historicoprojeto)
	c.JSON(http.StatusCreated, historicoprojeto)
}

// PUT /api/historicoprojeto/:id
func AtualizarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := config.DB.First(&historicoprojeto, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.ShouldBindJSON(&historicoprojeto)
	config.DB.Omit("Projeto").Save(&historicoprojeto)
	c.JSON(http.StatusOK, historicoprojeto)
}

// DELETE /api/historicoprojeto/:id
func DeletarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := config.DB.First(&historicoprojeto, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	config.DB.Delete(&historicoprojeto)
	c.JSON(http.StatusOK, historicoprojeto)
}
