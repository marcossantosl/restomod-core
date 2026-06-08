package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET /api/upgraderestomod
func ListarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod []models.UpgradeRestomod

	// CORREÇÃO: Adicionado o '&' para passar o ponteiro e o Preload para carregar o projeto relacionado
	if err := config.DB.Preload("Projeto").Find(&upgradeRestomod).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": err.Error()})
		return
	}

	c.JSON(http.StatusOK, upgradeRestomod)
}

// GET /api/upgraderestomod/:id
func BuscarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	// Adicionado Preload aqui também caso precise ver o projeto no detalhe
	if err := config.DB.Preload("Projeto").First(&upgradeRestomod, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Upgrade Restomod não encontrado"})
		return
	}
	c.JSON(http.StatusOK, upgradeRestomod)
}

// POST /api/upgraderestomod
func CriarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	if err := c.ShouldBindJSON(&upgradeRestomod); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	// CORREÇÃO: Você não estava salvando no banco de dados de fato!
	if err := config.DB.Create(&upgradeRestomod).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao salvar no banco"})
		return
	}

	c.JSON(http.StatusCreated, upgradeRestomod)
}

// PUT /api/upgraderestomod/:id
func AtualizarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	if err := config.DB.First(&upgradeRestomod, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&upgradeRestomod); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	config.DB.Save(&upgradeRestomod)
	c.JSON(http.StatusOK, upgradeRestomod)
}

// DELETE /api/upgraderestomod/:id
func DeletarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	if err := config.DB.First(&upgradeRestomod, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Upgrade Restomod não encontrado"})
		return
	}
	config.DB.Delete(&upgradeRestomod)
	c.JSON(http.StatusOK, upgradeRestomod)
}
