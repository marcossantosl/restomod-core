package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET /clientes
func ListarClientes(c *gin.Context) {
	var clientes []models.Cliente
	config.DB.Find(&clientes)
	c.JSON(http.StatusOK, clientes)
}

// GET /clientes/:id
func BuscarCliente(c *gin.Context) {
	var cliente models.Cliente
	if err := config.DB.First(&cliente, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}
	c.JSON(http.StatusOK, cliente)
}

// POST /clientes
func CriarCliente(c *gin.Context) {
	var cliente models.Cliente
	if err := c.ShouldBindJSON(&cliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&cliente)
	c.JSON(http.StatusCreated, cliente)
}

// PUT /clientes/:id
func AtualizarCliente(c *gin.Context) {
	var cliente models.Cliente
	if err := config.DB.First(&cliente, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}
	if err := c.ShouldBindJSON(&cliente); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Save(&cliente)
	c.JSON(http.StatusOK, cliente)
}

// DELETE /clientes/:id
func DeletarCliente(c *gin.Context) {
	var cliente models.Cliente
	if err := config.DB.First(&cliente, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Cliente não encontrado"})
		return
	}
	config.DB.Delete(&cliente)
	c.JSON(http.StatusOK, gin.H{"mensagem": "Cliente deletado com sucesso"})
}
