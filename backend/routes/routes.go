package routes

import (
	"projeto-oficina/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {

	api := r.Group("/api")

	// ─── Clientes ──────────────────────────────────────────────
	clientes := api.Group("/clientes")
	{
		clientes.GET("", handlers.ListarClientes)
		clientes.GET("/:id", handlers.BuscarCliente)
		clientes.POST("", handlers.CriarCliente)
		clientes.PUT("/:id", handlers.AtualizarCliente)
		clientes.DELETE("/:id", handlers.DeletarCliente)
	}

	// ─── Projetos ──────────────────────────────────────────────
	projetos := api.Group("/projetos")
	{
		projetos.GET("", handlers.ListarProjetos)
		projetos.GET("/:id", handlers.BuscarProjeto)
		projetos.POST("", handlers.CriarProjeto)
		projetos.PUT("/:id", handlers.AtualizarProjeto)
		projetos.DELETE("/:id", handlers.DeletarProjeto)
	}

	// ─── Veículos ──────────────────────────────────────────────
	veiculos := api.Group("/veiculos")
	{
		veiculos.GET("", handlers.ListarVeiculos)
		veiculos.GET("/:id", handlers.BuscarVeiculo)
		veiculos.POST("", handlers.CriarVeiculo)
		veiculos.PUT("/:id", handlers.AtualizarVeiculo)
		veiculos.DELETE("/:id", handlers.DeletarVeiculo)
	}

	// ─── Mecânicos ─────────────────────────────────────────────
	mecanicos := api.Group("/mecanicos")
	{
		mecanicos.GET("", handlers.ListarMecanicos)
		mecanicos.GET("/:id", handlers.BuscarMecanico)
		mecanicos.POST("", handlers.CriarMecanico)
		mecanicos.PUT("/:id", handlers.AtualizarMecanico)
		mecanicos.DELETE("/:id", handlers.DeletarMecanico)
	}

	// ─── Peças ─────────────────────────────────────────────────
	pecas := api.Group("/pecas")
	{
		pecas.GET("", handlers.ListarPecas)
		pecas.GET("/:id", handlers.BuscarPeca)
		pecas.POST("", handlers.CriarPeca)
		pecas.PUT("/:id", handlers.AtualizarPeca)
		pecas.DELETE("/:id", handlers.DeletarPeca)
	}

	// ─── Serviços ──────────────────────────────────────────────
	servicos := api.Group("/servicos")
	{
		servicos.GET("", handlers.ListarServicos)
		servicos.GET("/:id", handlers.BuscarServico)
		servicos.POST("", handlers.CriarServico)
		servicos.PUT("/:id", handlers.AtualizarServico)
		servicos.DELETE("/:id", handlers.DeletarServico)
	}
}
