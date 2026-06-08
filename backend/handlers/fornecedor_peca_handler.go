package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET /api/fornecedorpeca
func ListarFornecedorPeca(c *gin.Context) {
	var registros []models.FornecedorPeca
	// CORREÇÃO: Preloads ajustados para a tabela correta
	config.DB.Preload("Peca").Preload("Fornecedor").Find(&registros)
	c.JSON(http.StatusOK, registros)
}

// POST /api/fornecedorpeca
func CriarFornecedorPeca(c *gin.Context) {
	var fornecedorpeca models.FornecedorPeca
	if err := c.ShouldBindJSON(&fornecedorpeca); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}
	config.DB.Create(&fornecedorpeca)
	c.JSON(http.StatusCreated, fornecedorpeca)
}

// DELETE /api/fornecedorpeca/limpar — Deleta todos os vínculos de uma peça (O que o Front pede!)
func LimparFornecedoresDaPeca(c *gin.Context) {
	idPeca := c.Query("id_peca")

	// CORREÇÃO: Apagando pelo id_peca correto
	if err := config.DB.Where("id_peca = ?", idPeca).Delete(&models.FornecedorPeca{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao limpar registros antigos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Registros antigos limpos com sucesso"})
}

// DELETE /api/fornecedorpeca — Deleta pontualmente pela PK composta
func DeletarFornecedorPeca(c *gin.Context) {
	// CORREÇÃO: Variáveis ajustadas
	idPeca := c.Query("id_peca")
	idFornecedor := c.Query("id_fornecedor")

	config.DB.Where("id_peca = ? AND id_fornecedor = ?", idPeca, idFornecedor).Delete(&models.FornecedorPeca{})
	c.JSON(http.StatusOK, gin.H{"mensagem": "Deletado"})
}
