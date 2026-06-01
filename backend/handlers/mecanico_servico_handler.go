package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET /api/mecanicoservico
func ListarMecanicoServico(c *gin.Context) {
	var registros []models.MecanicoServico
	// Corrigido para as propriedades começarem com letra maiúscula (struct definitions)
	if err := config.DB.Preload("Mecanico").Preload("Servico").Find(&registros).Error; err != nil {
		c.JSON(404, gin.H{"erro": "Registros não encontrados"})
		return
	}
	c.JSON(200, registros)
}

// POST /api/mecanicoservico
func CriarMecanicoServico(c *gin.Context) {
	var mecanicoservico models.MecanicoServico
	if err := c.ShouldBindJSON(&mecanicoservico); err != nil {
		c.JSON(400, gin.H{"erro": err.Error()})
		return
	}

	// Salva na tabela "realiza"
	if err := config.DB.Create(&mecanicoservico).Error; err != nil {
		c.JSON(500, gin.H{"erro": "Erro ao criar vínculo: " + err.Error()})
		return
	}
	c.JSON(201, mecanicoservico)
}

// DELETE /api/mecanicoservico
func DeletarMecanicoServico(c *gin.Context) {
	IDMecanico := c.Query("id_mecanico")
	IDServico := c.Query("id_servico")

	// Corrigido: Adicionado o "?" que faltava na query de exclusão pontual
	if err := config.DB.Where("id_mecanico = ? AND id_servico = ?", IDMecanico, IDServico).Delete(&models.MecanicoServico{}).Error; err != nil {
		c.JSON(500, gin.H{"erro": "Erro ao deletar"})
		return
	}
	c.JSON(200, gin.H{"Mensagem": "deletado"})
}

// DELETE /api/mecanicoservico/limpar
// Limpa todos os mecânicos vinculados a um serviço específico (usado antes de atualizar)
func LimparMecanicosDoServico(c *gin.Context) {
	IDServico := c.Query("id_servico")
	if err := config.DB.Where("id_servico = ?", IDServico).Delete(&models.MecanicoServico{}).Error; err != nil {
		c.JSON(500, gin.H{"erro": "Erro ao limpar registros antigos"})
		return
	}
	c.JSON(200, gin.H{"Mensagem": "Registros antigos limpos com sucesso"})
}
