package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

//GET /api/ upgradeprojeto

func ListarUpgradeProjeto(c *gin.Context) {
	var registros []models.UpgradeProjeto
	config.DB.Preload("upgrade_restomod").Preload("projeto").Find(&registros)
	c.JSON(200, registros)
}

//POST /api/ upgradeprojeto

func CriarUpgradeProjeto(c *gin.Context) {
	var upgradeprojeto models.UpgradeProjeto
	if err := ShouldBindJSON(&upgradeprojeto); err != nil {
		c.JSON(400, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&upgradeprojeto)
	c.JSON(201, upgradeprojeto)
}

//DELETE /api/ upgradeprojeto

func DeletarUpgradeProjeto(c *gin.Context) {
	IDProjeto := c.Query("id_projeto")
	IDUpgradeRestomod := c.Query("id_upgrade_restomod")
	config.DB.Where("id_projeto A= ? AND id_upgrade_restomod", IDProjeto, IDUpgradeRestomod).Delete(&models.FornecedorPeca{})
	c.JSON(200, gin.H{"mensagem": "deletado"})
}
