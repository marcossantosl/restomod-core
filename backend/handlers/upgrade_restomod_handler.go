package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

//GET/api/upgraderestomod

func ListarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod []models.UpgradeRestomod
	config.DB.Find(upgradeRestomod)
	c.JSON(200, upgradeRestomod)
}

//GET/api/upgraderestomod/:id

func BuscarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	if err := config.DB.First(&upgradeRestomod, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "usuário não encontrado"})
		return
	}
	c.JSON(http.StatusOK, upgradeRestomod)
}

//POST/api/upgraderestomod/:id

func CriarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	if err := c.ShouldBindJSON(&upgradeRestomod); err != nil {
		c.JSON(400, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(201, upgradeRestomod)
}

//PUT/api/upgraderestomod/:id

func AtualizarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	if err := config.DB.First(&upgradeRestomod, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	c.ShouldBindJSON(&upgradeRestomod)
	config.DB.Save(&upgradeRestomod)
	c.JSON(http.StatusOK, upgradeRestomod)
}

//DELETE/api/upgraderestomod/:id

func DeletarUpgradeRestomod(c *gin.Context) {
	var upgradeRestomod models.UpgradeRestomod
	if err := config.DB.First(&upgradeRestomod, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": "Upgrade Restomod não encontrado"})
		return
	}
	config.DB.Delete(&upgradeRestomod)
	c.JSON(http.StatusOK, upgradeRestomod)
}
