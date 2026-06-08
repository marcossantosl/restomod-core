package handlers

import (
	"fmt"
	"net/http"
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// GET /api/usopeca
func ListarUsoPeca(c *gin.Context) {
	var usopecas []models.UsoPeca

	// Traz os dados das tabelas relacionadas (Peca e Servico) e evita panic 500
	if err := config.DB.Preload("Peca").Preload("Servico").Find(&usopecas).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao listar uso de peças: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, usopecas)
}

// GET /api/usopeca/:id
func BuscarUsoPeca(c *gin.Context) {
	var usopeca models.UsoPeca
	if err := config.DB.First(&usopeca, c.Param("id")).Error; err != nil {
		c.JSON(404, gin.H{"erro": err.Error()})
		return
	}
	c.JSON(200, usopeca)
}

// POST /api/usopeca
func CriarUsoPeca(c *gin.Context) {
	var input models.UsoPeca
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	tx := config.DB.Begin()

	// 1. Busca a peça para checar o estoque real do banco
	var peca models.Peca
	if err := tx.First(&peca, input.IDPeca).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"erro": "Peça não encontrada no estoque"})
		return
	}

	// 2. Valida o estoque
	if peca.Estoque < input.Quantidade {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"erro": fmt.Sprintf("Estoque insuficiente. Quantidade atual: %d", peca.Estoque)})
		return
	}

	// 3. Faz a subtração em memória
	peca.Estoque -= input.Quantidade

	// 4. Usa Update() cirúrgico apenas na coluna "estoque"
	if err := tx.Model(&peca).Update("estoque", peca.Estoque).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao atualizar o estoque da peça"})
		return
	}

	// 5. Omit("Peca", "Servico") proíbe o GORM de tentar salvar as tabelas pai
	if err := tx.Omit("Peca", "Servico").Create(&input).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao registrar o uso da peça"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusCreated, input)
}

// PUT /api/usopeca/:id
func AtualizarUsoPeca(c *gin.Context) {
	id := c.Param("id")

	// 1. Inicia a Transação para garantir a integridade
	tx := config.DB.Begin()

	// 2. Busca o registro ANTIGO no banco (antes da edição)
	var usoPeca models.UsoPeca
	if err := tx.First(&usoPeca, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"erro": "Registro de uso não encontrado"})
		return
	}

	// 3. Recebe os dados NOVOS do frontend
	var input models.UsoPeca
	if err := c.ShouldBindJSON(&input); err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"erro": "JSON inválido: " + err.Error()})
		return
	}

	// ── MATEMÁTICA DE ESTOQUE ──────────────────────────────────────────

	// Cenario A: O usuário editou e TROCOU a peça inteira (ex: de Filtro para Correia)
	if usoPeca.IDPeca != input.IDPeca {
		// A.1 - Devolve a quantidade da peça antiga para o estoque
		var pecaAntiga models.Peca
		if tx.First(&pecaAntiga, usoPeca.IDPeca).Error == nil {
			tx.Model(&pecaAntiga).Update("estoque", pecaAntiga.Estoque+usoPeca.Quantidade)
		}

		// A.2 - Verifica se tem estoque e desconta da peça nova
		var pecaNova models.Peca
		if err := tx.First(&pecaNova, input.IDPeca).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusNotFound, gin.H{"erro": "Nova peça não encontrada"})
			return
		}
		if pecaNova.Estoque < input.Quantidade {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"erro": "Estoque insuficiente na nova peça"})
			return
		}
		tx.Model(&pecaNova).Update("estoque", pecaNova.Estoque-input.Quantidade)

	} else if usoPeca.Quantidade != input.Quantidade {
		// Cenario B: Manteve a mesma peça, mas ALTEROU A QUANTIDADE
		diferenca := input.Quantidade - usoPeca.Quantidade

		var peca models.Peca
		tx.First(&peca, usoPeca.IDPeca)

		// Se a diferença for positiva, precisamos de MAIS peças. Verifica se tem estoque.
		if diferenca > 0 && peca.Estoque < diferenca {
			tx.Rollback()
			c.JSON(http.StatusBadRequest, gin.H{"erro": "Estoque insuficiente para esse acréscimo"})
			return
		}

		// Faz a conta (funciona tanto para adicionar quanto para devolver)
		tx.Model(&peca).Update("estoque", peca.Estoque-diferenca)
	}

	// ── ATUALIZAÇÃO BLINDADA DO REGISTRO ───────────────────────────────

	// Passa os valores novos para a struct original (Já coloquei o ValorVenda do seu log!)
	usoPeca.IDPeca = input.IDPeca
	usoPeca.IDServico = input.IDServico
	usoPeca.Quantidade = input.Quantidade
	usoPeca.ValorVenda = input.ValorVenda

	// Força o GORM a executar um UPDATE apenas nas colunas que nos interessam.
	// O Select() garante que ele não tente atualizar as tabelas aninhadas nem tente dar INSERT.
	colunas := []string{"id_peca", "id_servico", "quantidade", "valor_venda"}

	if err := tx.Model(&usoPeca).Select(colunas).Updates(usoPeca).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Falha ao salvar a edição no banco"})
		return
	}

	// Se sobreviveu a tudo isso, confirma a transação no banco
	tx.Commit()

	c.JSON(http.StatusOK, usoPeca)
}

// DELETE /api/usopeca/:id
func DeletarUsoPeca(c *gin.Context) {
	id := c.Param("id")

	tx := config.DB.Begin()

	var usoPeca models.UsoPeca
	if err := tx.First(&usoPeca, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"erro": "Registro de uso não encontrado"})
		return
	}

	var peca models.Peca
	if err := tx.First(&peca, usoPeca.IDPeca).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusNotFound, gin.H{"erro": "Peça original não encontrada"})
		return
	}

	// Devolve a quantidade para o estoque
	peca.Estoque += usoPeca.Quantidade

	// Usa o Update cirúrgico aqui também por segurança
	if err := tx.Model(&peca).Update("estoque", peca.Estoque).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao devolver peça para o estoque"})
		return
	}

	if err := tx.Delete(&usoPeca).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao deletar o registro"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"mensagem": "Registro deletado e estoque restaurado"})
}
