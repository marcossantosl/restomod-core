package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET	 /Fornecedor
func ListarFornecedores(c *gin.Context) {
	var fornecedores []models.Fornecedor
	config.DB.Find(&fornecedores)
	c.JSON(http.StatusOK, fornecedores)
}

// GET /Fornecedor/:id
func BuscarFornecedor(c *gin.Context) {
	var fornecedor models.Fornecedor
	if err := config.DB.First(&fornecedor, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Fornecedor não encontrado"})
		return
	}
	c.JSON(http.StatusOK, fornecedor)
}

// POST /fornecedor
func CriarFornecedor(c *gin.Context) {
	var fornecedor models.Fornecedor
	if err := c.ShouldBindJSON(&fornecedor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&fornecedor)
	c.JSON(http.StatusCreated, fornecedor)
}

// put /clientes/:id
func AtualizarFornecedor(c *gin.Context) {
	var fornecedor models.Fornecedor
	if err := config.DB.First(&fornecedor, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Fornecedor não encontrado"})
		return
	}
	if err := c.ShouldBindJSON(&fornecedor); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Save(&fornecedor)
	c.JSON(http.StatusOK, fornecedor)
}

// DELETE /fornecedor/:id
func DeletarFornecedor(c *gin.Context) {
	var fornecedor models.Fornecedor
	if err := config.DB.First(&fornecedor, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Fornecedor não encontrado"})
		return
	}
	config.DB.Delete(&fornecedor)
	c.JSON(http.StatusOK, fornecedor)
}
