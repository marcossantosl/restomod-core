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
<<<<<<< HEAD
	if err := c.ShouldBindJSON(&upgradeprojeto); err != nil {
=======
	if err := ShouldBindJSON(&upgradeprojeto); err != nil {
>>>>>>> c02fbd1bc189c4bc4bbfcfb3fb05593a00d6c4f5
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
<<<<<<< HEAD
	config.DB.Where("id_projeto = ? AND id_upgrade_restomod = ?", IDProjeto, IDUpgradeRestomod).Delete(&models.UpgradeProjeto{})
=======
	config.DB.Where("id_projeto A= ? AND id_upgrade_restomod", IDProjeto, IDUpgradeRestomod).Delete(&models.FornecedorPeca{})
>>>>>>> c02fbd1bc189c4bc4bbfcfb3fb05593a00d6c4f5
	c.JSON(200, gin.H{"mensagem": "deletado"})
}
