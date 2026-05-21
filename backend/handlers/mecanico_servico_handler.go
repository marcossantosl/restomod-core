package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET /api/ mecanicoservico  config.DB.Preload
func ListarMecanicoServico(c *gin.Context) {
	var registros []models.MecanicoServico
	if err := config.DB.Preload("mecanico").Preload("servico").Find(&registros); err != nil {
		c.JSON(404, gin.H{"erro": "Registros não encontrados"})
		return
	}
	c.JSON(200, registros)
}

// post /api/ mecanicoservico config.DB.Create
func CriarMecanicoServico(c *gin.Context) {
	var mecanicoservico models.MecanicoServico
	if err := c.ShouldBindJSON(&mecanicoservico); err != nil {
		c.JSON(400, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&mecanicoservico)
	c.JSON(201, mecanicoservico)
}

//delete /api/ mecanicoservico c.Query config.DB.Where().Delete

func DeletarMecanicoServico(c *gin.Context) {
	IDMecanico := c.Query("id_mecanico")
	IDServico := c.Query("id_servico")
	config.DB.Where("id_mecanico = ? AND id_servico = ", IDMecanico, IDServico).Delete(&models.MecanicoServico{})
	c.JSON(200, gin.H{"Mensagem": "deletado"})
}
