package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET /api/fornecedorpeca
func ListarFornecedorPeca(c *gin.Context) {
	var registros []models.FornecedorPeca
	config.DB.Preload("Mecanico").Preload("Servico").Find(&registros)
	c.JSON(200, registros)
}

// POST /api/fornecedorpeca
func CriarFornecedorPeca(c *gin.Context) {
	var fornecedorpeca models.FornecedorPeca
	if err := c.ShouldBindJSON(&fornecedorpeca); err != nil {
		c.JSON(400, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&fornecedorpeca)
	c.JSON(201, fornecedorpeca)
}

// DELETE /api/fornecedorpeca — deleta pela PK composta
func DeletarFornecedorPeca(c *gin.Context) {
	idMecanico := c.Query("id_mecanico")
	idServico := c.Query("id_servico")
	config.DB.Where("id_mecanico = ? AND id_servico = ?", idMecanico, idServico).
		Delete(&models.FornecedorPeca{})
	c.JSON(200, gin.H{"mensagem": "Deletado"})
}
