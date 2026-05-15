package main

import (
	"log"
	"os"
	"projeto-oficina/config"
	"projeto-oficina/models"
	"projeto-oficina/routes"

	"github.com/gin-gonic/gin"
)

func main() {
	// Conecta ao banco de dados
	config.ConnectDatabase()

	// Cria as tabelas automaticamente se não existirem
config.DB.Config.DisableForeignKeyConstraintWhenMigrating = true

// Roda a migração (a ordem agora importa menos, mas mantenha a lógica)
config.DB.AutoMigrate(
    &models.Oficina{},
    &models.Cliente{},
    &models.Veiculo{},
    &models.Peca{},
    &models.Mecanico{},
    &models.Projeto{},
    &models.Servico{},
)

config.DB.Config.DisableForeignKeyConstraintWhenMigrating = false
	// Inicializa o Gin
	r := gin.Default()

	// Permite requisições do frontend (CORS)
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// Registra as rotas
	routes.SetupRoutes(r)

	// Inicia o servidor
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("🚀 Servidor rodando na porta %s", port)
	r.Run(":" + port)
}
