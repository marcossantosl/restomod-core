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
	if err := config.DB.Preload("Projeto").Preload("Mecanicos").Find(&servicos).Error; err != nil {
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

func AtualizarServico(c *gin.Context) {
	var servico models.Servico

	// 1. Busca os dados antigos do banco
	if err := config.DB.First(&servico, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Serviço não encontrado"})
		return
	}

	// 2. CORREÇÃO: Faz o Bind em uma struct separada (input) para validar erros
	var input models.Servico
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Erro no JSON: " + err.Error()})
		return
	}

	// 3. CORREÇÃO: Atualiza apenas as colunas primitivas com .Updates()
	// Isso impede que o GORM tente sobrescrever as tabelas de Projetos ou Mecânicos
	if err := config.DB.Model(&servico).Updates(map[string]interface{}{
		"horas_realizadas": input.HorasRealizadas,
		"horas_estimadas":  input.HorasEstimadas,
		"valor":            input.Valor,
		"categoria":        input.Categoria,
		"descricao":        input.Descricao,
		"id_projeto":       input.IDProjeto,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao salvar: " + err.Error()})
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
