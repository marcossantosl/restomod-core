package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// ─── PROJETO ─────────────────────────────────────────────────────

func ListarProjetos(c *gin.Context) {
	var projetos []models.Projeto
	config.DB.Preload("Cliente").Preload("Oficina").Find(&projetos)
	c.JSON(http.StatusOK, projetos)
}

func BuscarProjeto(c *gin.Context) {
	var projeto models.Projeto
	if err := config.DB.Preload("Cliente").Preload("Oficina").First(&projeto, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Projeto não encontrado"})
		return
	}
	c.JSON(http.StatusOK, projeto)
}

func CriarProjeto(c *gin.Context) {
	var projeto models.Projeto
	if err := c.ShouldBindJSON(&projeto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&projeto)
	c.JSON(http.StatusCreated, projeto)
}

func AtualizarProjeto(c *gin.Context) {
	var projeto models.Projeto
	if err := config.DB.First(&projeto, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Projeto não encontrado"})
		return
	}
	c.ShouldBindJSON(&projeto)
	config.DB.Save(&projeto)
	c.JSON(http.StatusOK, projeto)
}

func DeletarProjeto(c *gin.Context) {
	config.DB.Delete(&models.Projeto{}, c.Param("id"))
	c.JSON(http.StatusOK, gin.H{"mensagem": "Projeto deletado"})
}
