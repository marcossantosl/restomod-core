package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

//GET/API/ usopeca

func ListarUsoPeca(c *gin.Context) {
	var usopecas []models.UsoPeca
	config.DB.Find(&usopecas)
	c.JSON(200, usopecas)
}

//GET/API/USOPECA/:ID

func BuscarUsoPeca(c *gin.Context) {
	var usopeca models.UsoPeca
	if err := config.DB.First(&usopeca, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(200, usopeca)
}

// POST/API/USOPECA/
func InserirUsoPeca(c *gin.Context) {
	var usopeca models.UsoPeca
	if err := c.ShouldBindJSON(&usopeca); err != nil {
		c.JSON(400, gin.H{"erro": " Não foi possível inserir usuário, bad request"})
		return
	}
	config.DB.Create(&usopeca)
	c.JSON(201, usopeca)
}

//PUT/API/USOPECA:id

func AtualizarUsoPeca(c *gin.Context) {
	var usopeca models.UsoPeca
	if err := config.DB.First(&usopeca, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	if err := c.ShouldBindJSON(&usopeca); err != nil {
		c.JSON(400, gin.H{"erro": "Não foi possível inserir usuário, bad request"})
		return
	}
	config.DB.Save(&usopeca)
	c.JSON(201, usopeca)
}
