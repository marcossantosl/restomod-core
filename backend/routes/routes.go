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

	// ─── Uso Peca ─────────────────────────────────────────────────
	usoPeca := api.Group("/usopeca")
	{
		usoPeca.GET("", handlers.ListarUsoPeca)
		usoPeca.GET("/:id", handlers.BuscarUsoPeca)
		usoPeca.POST("", handlers.CriarUsoPeca)
		usoPeca.PUT("/:id", handlers.AtualizarUsoPeca)
		usoPeca.DELETE("/:id", handlers.DeletarUsoPeca)
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

	// ─── Fornecedor ──────────────────────────────────────────────
	fornecedor := api.Group("/fornecedor")
	{
		fornecedor.GET("", handlers.ListarFornecedores)
		fornecedor.GET("/:id", handlers.BuscarFornecedor)
		fornecedor.POST("", handlers.CriarFornecedor)
		fornecedor.PUT("/:id", handlers.AtualizarFornecedor)
		fornecedor.DELETE("/:id", handlers.DeletarFornecedor)
	}

	// ─── Fornecedor Peça (fornece) ──────────────────────────────────────────────
	fornecedorPeca := api.Group("/fornecedorpeca")
	{
		fornecedorPeca.GET("", handlers.ListarFornecedorPeca)
		fornecedorPeca.POST("", handlers.CriarFornecedorPeca)
		fornecedorPeca.DELETE("", handlers.DeletarFornecedorPeca)

		// A ROTA NOVA ENTRA AQUI!
		// Como já está no grupo, ela vira automaticamente /api/fornecedorpeca/limpar
		fornecedorPeca.DELETE("/limpar", handlers.LimparFornecedoresDaPeca)
	}
	// ─── Historico Projeto ──────────────────────────────────────────────
	historicoProjeto := api.Group("/historicoprojeto")
	{
		historicoProjeto.GET("", handlers.ListarHistoricoProjeto)
		historicoProjeto.GET("/:id", handlers.BuscarHistoricoProjeto)
		historicoProjeto.POST("", handlers.CriarHistoricoProjeto)
		historicoProjeto.PUT("/:id", handlers.AtualizarHistoricoProjeto)
		historicoProjeto.DELETE("/:id", handlers.DeletarHistoricoProjeto)
	}

	// ─── Inspecao ──────────────────────────────────────────────
	inspecao := api.Group("/inspecao")
	{
		inspecao.GET("", handlers.ListarInspecao)
		inspecao.GET("/:id", handlers.BuscarInspecao)
		inspecao.POST("", handlers.CriarInspecao)
		inspecao.PUT("/:id", handlers.AtualizarInspecao)
		inspecao.DELETE("/:id", handlers.DeletarInspecao)
	}

	// ─── Mecanico Serviço (realiza) ──────────────────────────────────────────────
	mecanicoServico := api.Group("/mecanicoservico")
	{
		mecanicoServico.GET("", handlers.ListarMecanicoServico)
		mecanicoServico.POST("", handlers.CriarMecanicoServico)
		mecanicoServico.DELETE("", handlers.DeletarMecanicoServico)
		mecanicoServico.DELETE("/limpar", handlers.LimparMecanicosDoServico)
	}

	// ─── Oficina ──────────────────────────────────────────────
	oficina := api.Group("/oficinas")
	{
		oficina.GET("", handlers.ListarOficinas)
		oficina.GET("/:id", handlers.BuscarOficina)
		oficina.POST("", handlers.CriarOficina)
		oficina.PUT("/:id", handlers.AtualizarOficina)
		oficina.DELETE("/:id", handlers.DeletarOficina)
	}

	// ─── Upgrade Restomod  ──────────────────────────────────────────────
	upgradeRestomod := api.Group("/upgraderestomod")
	{
		upgradeRestomod.GET("", handlers.ListarUpgradeRestomod)
		upgradeRestomod.GET("/:id", handlers.BuscarUpgradeRestomod)
		upgradeRestomod.POST("", handlers.CriarUpgradeRestomod)
		upgradeRestomod.PUT("/:id", handlers.AtualizarUpgradeRestomod)
		upgradeRestomod.DELETE("/:id", handlers.DeletarUpgradeRestomod)
	}

	dashboard := api.Group("/dashboard")
	{
		dashboard.GET("/servicos-por-oficina", handlers.ConsultaServicosPorOficina)
		dashboard.GET("/horas-por-mecanico", handlers.ConsultaHorasPorMecanico)
		dashboard.GET("/pecas-utilizadas", handlers.ConsultaPecasUtilizadas)
	}

	api.POST("/seed", handlers.SeedBancoDados)
	api.DELETE("/drop", handlers.DropBancoDados)
}
