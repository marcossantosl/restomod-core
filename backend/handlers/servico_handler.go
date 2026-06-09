package handlers

import (
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// ─── SERVIÇO ─────────────────────────────────────────────────────

func ListarServicos(c *gin.Context) {
	var servicos []models.Servico

	// Preload carrega o projeto e os mecânicos associados na listagem
	if err := config.DB.Preload("Projeto").Preload("Mecanicos").Preload("UpgradeRestomod").Find(&servicos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao listar serviços"})
		return
	}

	c.JSON(http.StatusOK, servicos)
}

func BuscarServico(c *gin.Context) {
	var servico models.Servico

	// Adicionado Preload de Mecânicos aqui também para a busca individual
	if err := config.DB.Preload("Projeto").Preload("Mecanicos").First(&servico, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Serviço não encontrado"})
		return
	}

	c.JSON(http.StatusOK, servico)
}

func CriarServico(c *gin.Context) {
	var servico models.Servico
	if err := c.ShouldBindJSON(&servico); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Erro no formato dos dados: " + err.Error()})
		return
	}

	// Adicionado tratamento de erro na hora de criar no banco
	if err := config.DB.Create(&servico).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao criar serviço: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, servico)
}

// / PUT /api/servicos/:id
func AtualizarServico(c *gin.Context) {
	id := c.Param("id")

	// 1. Busca o registro atual no banco
	var servico models.Servico
	if err := config.DB.First(&servico, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Serviço não encontrado"})
		return
	}

	// 2. Recebe o JSON com os dados editados do frontend
	var input models.Servico
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido: " + err.Error()})
		return
	}

	// 3. COPIA BLINDADA DE CAMPOS (O segredo está aqui)
	servico.Categoria = input.Categoria
	servico.Descricao = input.Descricao
	servico.HorasEstimadas = input.HorasEstimadas
	servico.HorasRealizadas = input.HorasRealizadas
	servico.Valor = input.Valor
	servico.IDProjeto = input.IDProjeto

	// A MÁGICA: Atualiza o ponteiro do Upgrade (transfere o ID ou o NULL perfeitamente)
	servico.IDUpgradeRestomod = input.IDUpgradeRestomod

	// 4. Salva no banco ignorando as tabelas aninhadas para não dar bug
	if err := config.DB.Omit("Projeto", "UpgradeRestomod", "Mecanicos").Save(&servico).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao salvar a edição"})
		return
	}

	c.JSON(http.StatusOK, servico)
}

func DeletarServico(c *gin.Context) {
	// Verifica se existe e deleta capturando possíveis erros do banco (ex: chaves estrangeiras)
	if err := config.DB.Delete(&models.Servico{}, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao deletar serviço: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"mensagem": "Serviço deletado"})
}
