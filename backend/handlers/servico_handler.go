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

// AtualizarServico atualiza apenas os campos primitivos de um serviço,
// protegendo os relacionamentos de Projetos ou Mecânicos.
func AtualizarServico(c *gin.Context) {
	var servico models.Servico

	// 1. Busca os dados antigos do banco pelo ID da URL
	if err := config.DB.First(&servico, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"erro": "Serviço não encontrado"})
		return
	}

	// 2. Faz o Bind do JSON enviado para uma struct de input
	var input models.Servico
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Erro no JSON: " + err.Error()})
		return
	}

	// 3. Atualiza APENAS as colunas específicas no banco de dados
	err := config.DB.Model(&servico).Updates(map[string]interface{}{
		"horas_realizadas": input.HorasRealizadas,
		"horas_estimadas":  input.HorasEstimadas,
		"valor":            input.Valor,
		"categoria":        input.Categoria,
		"descricao":        input.Descricao,
		"id_projeto":       input.IDProjeto,
	}).Error

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao salvar no banco: " + err.Error()})
		return
	}

	// 4. Retorna o objeto atualizado e o status 200 OK
	// Nota: Como usamos o Model(&servico), o GORM atualiza o próprio objeto 'servico' na memória com os novos dados do mapa.
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
