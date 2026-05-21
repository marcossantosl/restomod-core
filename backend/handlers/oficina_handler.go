package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET	 /oficina
func ListarOficinas(c *gin.Context) {
	var oficinas []models.Oficina
	config.DB.Find(&oficinas)
	c.JSON(http.StatusOK, oficinas)
}

// GET /oficina/:id
func BuscarOficina(c *gin.Context) {
	var oficina models.Oficina
	if err := config.DB.First(&oficina, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "oficina não encontrada"})
		return
	}
	c.JSON(http.StatusOK, oficina)
}

// POST /oficina
func CriarOficina(c *gin.Context) {
	var oficina models.Oficina
	if err := c.ShouldBindJSON(&oficina); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&oficina)
	c.JSON(http.StatusCreated, oficina)
}

// put /clientes/:id
func AtualizarOficina(c *gin.Context) {
	var oficina models.Oficina
	if err := config.DB.First(&oficina, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "oficina não encontrada"})
		return
	}
	if err := c.ShouldBindJSON(&oficina); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Save(&oficina)
	c.JSON(http.StatusOK, oficina)
}

// DELETE /oficina/:id
func DeletarOficina(c *gin.Context) {
	var oficina models.Oficina
	if err := config.DB.First(&oficina, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "oficina não encontrada"})
		return
	}
	config.DB.Delete(&oficina)
	c.JSON(http.StatusOK, oficina)
}
