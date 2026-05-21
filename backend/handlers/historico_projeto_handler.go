package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

//GET /API/historicoprojeto  config.DB.Find

func ListarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto []models.HistoricoProjeto
	config.DB.Find(&historicoprojeto)
	c.JSON(200, historicoprojeto)
}

// GET /API/historicoprojeto/:id config.DB.First
func BuscarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := config.DB.First(&historicoprojeto, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(200, historicoprojeto)
}

// POST /API/historicoprojeto  config.DB.Create
func CriarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := c.ShouldBindJSON(&historicoprojeto); err != nil {
		c.JSON(400, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&historicoprojeto)
	c.JSON(201, historicoprojeto)
}

// PUT /API/historicoprojeto/:id config.DB.Save
func AtualizarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := config.DB.First(&historicoprojeto, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"error": err.Error()})
		return
	}
	c.ShouldBindJSON(&historicoprojeto)
	config.DB.Save(&historicoprojeto)
	c.JSON(201, historicoprojeto)
}

// DELETE /historicoprojeto/:id config.DB.Delete
func DeletarHistoricoProjeto(c *gin.Context) {
	var historicoprojeto models.HistoricoProjeto
	if err := config.DB.First(&historicoprojeto, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"error": err.Error()})
		return
	}
	config.DB.Delete(&historicoprojeto)
	c.JSON(200, historicoprojeto)
}
