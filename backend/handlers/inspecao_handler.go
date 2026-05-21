package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

func ListarInspecao(c *gin.Context) {
	var inspecao []models.Inspecao
	config.DB.Find(&inspecao)
	c.JSON(200, inspecao)
}

func BuscarInspecao(c *gin.Context) {
	var inspecao models.Inspecao
	if err := config.DB.First(&inspecao, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(200, inspecao)
}

func CriarInspecao(c *gin.Context) {
	var inspecao models.Inspecao
	if err := c.ShouldBindJSON(&inspecao); err != nil {
		c.JSON(400, gin.H{"erro": "Não foi possível inserir inspeção"})
		return
	}
	config.DB.Create(&inspecao)
	c.JSON(201, inspecao)
}

func AtualizarInspecao(c *gin.Context) {
	var inspecao models.Inspecao
	if err := config.DB.First(&inspecao, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	c.ShouldBindJSON(&inspecao)
	config.DB.Save(&inspecao)
	c.JSON(201, inspecao)
}

func DeletarInspecao(c *gin.Context) {
	var inspecao models.Inspecao
	if err := config.DB.First(&inspecao, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Delete(&inspecao)
	c.JSON(200, inspecao)
}
