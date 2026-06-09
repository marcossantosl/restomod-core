package handlers

import (
	"projeto-oficina/config"
	"projeto-oficina/models"

	"github.com/gin-gonic/gin"
)

// Função auxiliar para passar IDs opcionais (ponteiros) nos Serviços
func uintPtr(i uint) *uint {
	return &i
}

func SeedBancoDados(c *gin.Context) {
	db := config.DB

	// Limpa tudo antes de popular garantindo que os IDs voltem para 1
	db.Exec("TRUNCATE TABLE uso_peca, fornece, realiza, inspecao, historico_projeto, servico, upgrade_restomod, projeto, mecanico, veiculo, peca, fornecedor, cliente, oficina RESTART IDENTITY CASCADE")

	// ── Oficinas ──────────────────────────────────────────────
	oficinas := []models.Oficina{
		{Nome: "Garage Restomod SP", CNPJ: "11.222.333/0001-44", Especialidade: "Restomod e Preparação", Endereco: "Rua das Oficinas, 100 - SP", Telefone: "(11) 91111-1111"},
		{Nome: "Classic Motorsport RJ", CNPJ: "22.333.444/0001-55", Especialidade: "Restauração Clássicos", Endereco: "Av. Brasil, 500 - RJ", Telefone: "(21) 92222-2222"},
		{Nome: "Turbo Performance BH", CNPJ: "33.444.555/0001-66", Especialidade: "Motor e Turbo", Endereco: "Rua Minas, 200 - BH", Telefone: "(31) 93333-3333"},
	}
	db.Create(&oficinas)

	// ── Clientes (Colunas Endereco preenchidas) ─────────────────
	clientes := []models.Cliente{
		{Nome: "Carlos Mendes", CPF: "111.222.333-01", Email: "carlos@email.com", Endereco: "Rua A, 10", Telefone: "(11) 91001-0001"},
		{Nome: "Ana Souza", CPF: "111.222.333-02", Email: "ana@email.com", Endereco: "Rua B, 20", Telefone: "(11) 91001-0002"},
		{Nome: "Roberto Lima", CPF: "111.222.333-03", Email: "roberto@email.com", Endereco: "Rua C, 30", Telefone: "(21) 91001-0003"},
		{Nome: "Fernanda Costa", CPF: "111.222.333-04", Email: "fernanda@email.com", Endereco: "Rua D, 40", Telefone: "(21) 91001-0004"},
		{Nome: "Marcelo Vieira", CPF: "111.222.333-05", Email: "marcelo@email.com", Endereco: "Rua E, 50", Telefone: "(31) 91001-0005"},
		{Nome: "Juliana Alves", CPF: "111.222.333-06", Email: "juliana@email.com", Endereco: "Rua F, 60", Telefone: "(31) 91001-0006"},
		{Nome: "Paulo Rodrigues", CPF: "111.222.333-07", Email: "paulo@email.com", Endereco: "Rua G, 70", Telefone: "(11) 91001-0007"},
		{Nome: "Camila Ferreira", CPF: "111.222.333-08", Email: "camila@email.com", Endereco: "Rua H, 80", Telefone: "(11) 91001-0008"},
		{Nome: "André Nascimento", CPF: "111.222.333-09", Email: "andre@email.com", Endereco: "Rua I, 90", Telefone: "(21) 91001-0009"},
		{Nome: "Lucia Barbosa", CPF: "111.222.333-10", Email: "lucia@email.com", Endereco: "Rua J, 100", Telefone: "(31) 91001-0010"},
	}
	db.Create(&clientes)

	// ── Fornecedores ──────────────────────────────────────────
	fornecedores := []models.Fornecedor{
		{Nome: "Magneti Marelli BR", Especialidade: "Injeção e Eletrônica", Contato: "vendas@magneti.com.br"},
		{Nome: "Bosch Peças", Especialidade: "Freios e Suspensão", Contato: "vendas@bosch.com.br"},
		{Nome: "Garrett Turbos Brasil", Especialidade: "Turbinas e Compressores", Contato: "contato@garrett.com.br"},
		{Nome: "ACL Bronzinas", Especialidade: "Motor e Interno", Contato: "vendas@acl.com.br"},
		{Nome: "NGK Velas", Especialidade: "Ignição", Contato: "contato@ngk.com.br"},
	}
	db.Create(&fornecedores)

	// ── Veículos (Placa, Chassi e IDCliente preenchidos) ─────────
	veiculos := []models.Veiculo{
		{Marca: "Chevrolet", Modelo: "Opala 2500", Placa: "ABC-1234", Chassi: "9BW12345678", AnoFabricacao: 1975, Status: "Em restauração", Categoria: "Restomod", WHPOriginal: 85, KGFMOriginal: 17, IDCliente: 1},
		{Marca: "Volkswagen", Modelo: "Fusca 1300", Placa: "DEF-5678", Chassi: "9BW87654321", AnoFabricacao: 1972, Status: "Em restauração", Categoria: "Clássico", WHPOriginal: 40, KGFMOriginal: 8, IDCliente: 2},
		{Marca: "Ford", Modelo: "Maverick V8", Placa: "GHI-9012", Chassi: "9BF11122233", AnoFabricacao: 1977, Status: "Concluído", Categoria: "Restomod", WHPOriginal: 120, KGFMOriginal: 22, IDCliente: 3},
		{Marca: "Chevrolet", Modelo: "Veraneio", Placa: "JKL-3456", Chassi: "9BW44455566", AnoFabricacao: 1980, Status: "Em restauração", Categoria: "Restomod", WHPOriginal: 95, KGFMOriginal: 20, IDCliente: 4},
		{Marca: "Volkswagen", Modelo: "Brasília", Placa: "MNO-7890", Chassi: "9BW77788899", AnoFabricacao: 1978, Status: "Aguardando", Categoria: "Clássico", WHPOriginal: 45, KGFMOriginal: 9, IDCliente: 5},
		{Marca: "Ford", Modelo: "Corcel II", Placa: "PQR-1234", Chassi: "9BF00011122", AnoFabricacao: 1979, Status: "Em restauração", Categoria: "Restomod", WHPOriginal: 75, KGFMOriginal: 14, IDCliente: 6},
		{Marca: "Chevrolet", Modelo: "Chevette SR", Placa: "STU-5678", Chassi: "9BW33344455", AnoFabricacao: 1982, Status: "Concluído", Categoria: "Restomod", WHPOriginal: 65, KGFMOriginal: 12, IDCliente: 7},
		{Marca: "Volkswagen", Modelo: "SP2", Placa: "VWX-9012", Chassi: "9BW66677788", AnoFabricacao: 1974, Status: "Em restauração", Categoria: "Clássico", WHPOriginal: 65, KGFMOriginal: 13, IDCliente: 8},
		{Marca: "Ford", Modelo: "Galaxie 500", Placa: "YZA-3456", Chassi: "9BF99900011", AnoFabricacao: 1971, Status: "Concluído", Categoria: "Restomod", WHPOriginal: 140, KGFMOriginal: 28, IDCliente: 9},
		{Marca: "Dodge", Modelo: "Charger RT", Placa: "BCD-7890", Chassi: "9BD22233344", AnoFabricacao: 1976, Status: "Aguardando", Categoria: "Restomod", WHPOriginal: 130, KGFMOriginal: 25, IDCliente: 10},
	}
	db.Create(&veiculos)

	// ── Peças ─────────────────────────────────────────────────
	pecas := []models.Peca{
		{Nome: "Motor LS3 6.2 V8 GM", Fabricante: "General Motors", Origem: "EUA", Estoque: 3, NumeroPeca: 1001, PrecoReferencia: 45000, TipoPeca: "Motor"},
		{Nome: "Câmbio T56 6 Marchas", Fabricante: "Tremec", Origem: "EUA", Estoque: 5, NumeroPeca: 1002, PrecoReferencia: 18000, TipoPeca: "Transmissão"},
		{Nome: "Turbina Garrett GT3582", Fabricante: "Garrett", Origem: "EUA", Estoque: 4, NumeroPeca: 1003, PrecoReferencia: 8500, TipoPeca: "Turbo"},
		{Nome: "Freio a Disco Wilwood 330mm", Fabricante: "Wilwood", Origem: "EUA", Estoque: 8, NumeroPeca: 1004, PrecoReferencia: 3200, TipoPeca: "Freio"},
		{Nome: "Suspensão Coilover KW V3", Fabricante: "KW", Origem: "Alemanha", Estoque: 6, NumeroPeca: 1005, PrecoReferencia: 12000, TipoPeca: "Suspensão"},
		{Nome: "Injeção Eletrônica Holley", Fabricante: "Holley", Origem: "EUA", Estoque: 10, NumeroPeca: 1006, PrecoReferencia: 5500, TipoPeca: "Injeção"},
		{Nome: "Escapamento Inox Mandrilado", Fabricante: "Borla", Origem: "EUA", Estoque: 15, NumeroPeca: 1007, PrecoReferencia: 2800, TipoPeca: "Escape"},
		{Nome: "Intercooler Front Mount", Fabricante: "Mishimoto", Origem: "EUA", Estoque: 7, NumeroPeca: 1008, PrecoReferencia: 3600, TipoPeca: "Resfriamento"},
		{Nome: "Bronzinas Motor ACL", Fabricante: "ACL", Origem: "Brasil", Estoque: 50, NumeroPeca: 1009, PrecoReferencia: 350, TipoPeca: "Motor"},
		{Nome: "Velas NGK Iridium", Fabricante: "NGK", Origem: "Japão", Estoque: 100, NumeroPeca: 1010, PrecoReferencia: 85, TipoPeca: "Ignição"},
	}
	db.Create(&pecas)

	// ── Mecânicos ─────────────────────────────────────────────
	mecanicos := []models.Mecanico{
		{Nome: "Ricardo Souza", CPF: "222.333.444-01", Especialidade: "Motor e Preparação", Nivel: "Sênior", IDOficina: 1},
		{Nome: "Diego Martins", CPF: "222.333.444-02", Especialidade: "Suspensão e Freios", Nivel: "Pleno", IDOficina: 1},
		{Nome: "Thiago Oliveira", CPF: "222.333.444-03", Especialidade: "Elétrica e Injeção", Nivel: "Sênior", IDOficina: 1},
		{Nome: "Lucas Pereira", CPF: "222.333.444-04", Especialidade: "Funilaria e Pintura", Nivel: "Pleno", IDOficina: 2},
		{Nome: "Gabriel Santos", CPF: "222.333.444-05", Especialidade: "Motor e Turbo", Nivel: "Sênior", IDOficina: 2},
		{Nome: "Felipe Carvalho", CPF: "222.333.444-06", Especialidade: "Transmissão", Nivel: "Júnior", IDOficina: 2},
		{Nome: "Mateus Costa", CPF: "222.333.444-07", Especialidade: "Motor e Preparação", Nivel: "Sênior", IDOficina: 3},
		{Nome: "Bruno Almeida", CPF: "222.333.444-08", Especialidade: "Turbo e Injeção", Nivel: "Pleno", IDOficina: 3},
		{Nome: "Henrique Lima", CPF: "222.333.444-09", Especialidade: "Suspensão", Nivel: "Júnior", IDOficina: 3},
		{Nome: "Eduardo Ribeiro", CPF: "222.333.444-10", Especialidade: "Elétrica Geral", Nivel: "Pleno", IDOficina: 1},
	}
	db.Create(&mecanicos)

	// ── Projetos (IDVeiculo preenchido com seu respectivo dono) ──
	projetos := []models.Projeto{
		{Titulo: "Opala LS Swap", DataInicio: "2024-01-10", DataPrevisao: "2024-06-30", OrcamentoTotal: 85000, CategoriaProjeto: "LS Swap", IDOficina: 1, IDCliente: 1, IDVeiculo: 1},
		{Titulo: "Fusca Turbo", DataInicio: "2024-02-15", DataPrevisao: "2024-08-15", OrcamentoTotal: 35000, CategoriaProjeto: "Turbo", IDOficina: 2, IDCliente: 2, IDVeiculo: 2},
		{Titulo: "Maverick V8 Restomod", DataInicio: "2023-11-01", DataPrevisao: "2024-04-30", OrcamentoTotal: 120000, CategoriaProjeto: "Restomod", IDOficina: 1, IDCliente: 3, IDVeiculo: 3},
		{Titulo: "Veraneio 4x4 Turbo", DataInicio: "2024-03-01", DataPrevisao: "2024-10-01", OrcamentoTotal: 95000, CategoriaProjeto: "Turbo 4x4", IDOficina: 3, IDCliente: 4, IDVeiculo: 4},
		{Titulo: "Brasília Restauração", DataInicio: "2024-01-20", DataPrevisao: "2024-05-20", OrcamentoTotal: 18000, CategoriaProjeto: "Restauração", IDOficina: 2, IDCliente: 5, IDVeiculo: 5},
		{Titulo: "Corcel II Restomod", DataInicio: "2024-04-01", DataPrevisao: "2024-09-01", OrcamentoTotal: 42000, CategoriaProjeto: "Restomod", IDOficina: 1, IDCliente: 6, IDVeiculo: 6},
		{Titulo: "Chevette Turbo", DataInicio: "2024-02-01", DataPrevisao: "2024-07-01", OrcamentoTotal: 28000, CategoriaProjeto: "Turbo", IDOficina: 3, IDCliente: 7, IDVeiculo: 7},
		{Titulo: "SP2 Restauração Total", DataInicio: "2023-12-01", DataPrevisao: "2024-06-01", OrcamentoTotal: 55000, CategoriaProjeto: "Restauração", IDOficina: 2, IDCliente: 8, IDVeiculo: 8},
		{Titulo: "Galaxie 500 Restomod", DataInicio: "2024-01-05", DataPrevisao: "2024-12-05", OrcamentoTotal: 150000, CategoriaProjeto: "Restomod V8", IDOficina: 1, IDCliente: 9, IDVeiculo: 9},
		{Titulo: "Charger RT Preparação", DataInicio: "2024-03-15", DataPrevisao: "2024-11-15", OrcamentoTotal: 110000, CategoriaProjeto: "Preparação", IDOficina: 3, IDCliente: 10, IDVeiculo: 10},
	}
	db.Create(&projetos)

	// ── Upgrades Restomod (Datas preenchidas) ─────────────────
	upgrades := []models.UpgradeRestomod{
		{SistemaAlvo: "Motor", VeiculoDoador: "Corvette C6", DescricaoAdaptacao: "Swap LS3 com adaptadores nacionais", WHPFinal: 430, KGFMFinal: 59, DataUpgradeInicio: "2024-02-01", DataUpgradeFim: "2024-06-15", IDProjeto: 1},
		{SistemaAlvo: "Turbo", VeiculoDoador: "Golf GTI Mk5", DescricaoAdaptacao: "Turbo Garrett adaptado VW 1600", WHPFinal: 180, KGFMFinal: 28, DataUpgradeInicio: "2024-03-10", DataUpgradeFim: "2024-08-01", IDProjeto: 2},
		{SistemaAlvo: "Motor", VeiculoDoador: "Mustang GT", DescricaoAdaptacao: "Rebuild V8 FE com peças forjadas", WHPFinal: 320, KGFMFinal: 45, DataUpgradeInicio: "2023-11-15", DataUpgradeFim: "2024-04-10", IDProjeto: 3},
		{SistemaAlvo: "Turbo+4x4", VeiculoDoador: "Patrol Y60", DescricaoAdaptacao: "Turbo e caixa transfer Patrol", WHPFinal: 280, KGFMFinal: 52, DataUpgradeInicio: "2024-04-01", DataUpgradeFim: "2024-09-20", IDProjeto: 4},
		{SistemaAlvo: "Motor", VeiculoDoador: "Golf GTI", DescricaoAdaptacao: "Motor 2.0 8v preparado", WHPFinal: 140, KGFMFinal: 22, DataUpgradeInicio: "2024-05-01", DataUpgradeFim: "2024-08-20", IDProjeto: 6},
		{SistemaAlvo: "Turbo", VeiculoDoador: "Gol GTI", DescricaoAdaptacao: "Turbo AP 2.0 com injeção", WHPFinal: 220, KGFMFinal: 35, DataUpgradeInicio: "2024-03-01", DataUpgradeFim: "2024-06-25", IDProjeto: 7},
		{SistemaAlvo: "Motor", VeiculoDoador: "F-100", DescricaoAdaptacao: "Swap FE 428 original Ford", WHPFinal: 390, KGFMFinal: 65, DataUpgradeInicio: "2024-02-15", DataUpgradeFim: "2024-11-30", IDProjeto: 9},
		{SistemaAlvo: "Motor", VeiculoDoador: "Charger Daytona", DescricaoAdaptacao: "Motor Hemi 440 preparado", WHPFinal: 480, KGFMFinal: 72, DataUpgradeInicio: "2024-04-10", DataUpgradeFim: "2024-11-01", IDProjeto: 10},
	}
	db.Create(&upgrades)

	// ── Serviços (IDUpgradeRestomod alocado dinamicamente) ──────
	servicos := []models.Servico{
		{Categoria: "Motor", Descricao: "Swap motor LS3", HorasEstimadas: 80, HorasRealizadas: 75, Valor: 12000, IDProjeto: 1, IDUpgradeRestomod: uintPtr(1)},
		{Categoria: "Transmissão", Descricao: "Instalação câmbio T56", HorasEstimadas: 20, HorasRealizadas: 22, Valor: 3500, IDProjeto: 1, IDUpgradeRestomod: uintPtr(1)},
		{Categoria: "Turbo", Descricao: "Kit turbo completo", HorasEstimadas: 40, HorasRealizadas: 38, Valor: 6000, IDProjeto: 2, IDUpgradeRestomod: uintPtr(2)},
		{Categoria: "Suspensão", Descricao: "Coilover e geometria", HorasEstimadas: 16, HorasRealizadas: 18, Valor: 2800, IDProjeto: 2}, // Sem upgrade amarrado (Manutenção)
		{Categoria: "Motor", Descricao: "Rebuild motor V8 Ford", HorasEstimadas: 60, HorasRealizadas: 58, Valor: 9500, IDProjeto: 3, IDUpgradeRestomod: uintPtr(3)},
		{Categoria: "Freios", Descricao: "Freios Wilwood 4 pistões", HorasEstimadas: 12, HorasRealizadas: 10, Valor: 4200, IDProjeto: 3},
		{Categoria: "Motor", Descricao: "Turbo e intercooler", HorasEstimadas: 50, HorasRealizadas: 55, Valor: 8000, IDProjeto: 4, IDUpgradeRestomod: uintPtr(4)},
		{Categoria: "Elétrica", Descricao: "Injeção eletrônica completa", HorasEstimadas: 30, HorasRealizadas: 28, Valor: 4500, IDProjeto: 4},
		{Categoria: "Funilaria", Descricao: "Restauração carroceria", HorasEstimadas: 100, HorasRealizadas: 95, Valor: 15000, IDProjeto: 5},
		{Categoria: "Pintura", Descricao: "Pintura original restaurada", HorasEstimadas: 60, HorasRealizadas: 65, Valor: 8000, IDProjeto: 5},
	}
	db.Create(&servicos)

	// ── Realiza (N:N mecânico x serviço) ──────────────────────
	realiza := []models.MecanicoServico{
		{IDServico: 1, IDMecanico: 1}, {IDServico: 1, IDMecanico: 3},
		{IDServico: 2, IDMecanico: 1}, {IDServico: 2, IDMecanico: 6},
		{IDServico: 3, IDMecanico: 5}, {IDServico: 3, IDMecanico: 8},
		{IDServico: 4, IDMecanico: 2}, {IDServico: 4, IDMecanico: 9},
		{IDServico: 5, IDMecanico: 1}, {IDServico: 5, IDMecanico: 7},
		{IDServico: 6, IDMecanico: 2},
		{IDServico: 7, IDMecanico: 7}, {IDServico: 7, IDMecanico: 8},
		{IDServico: 8, IDMecanico: 3}, {IDServico: 8, IDMecanico: 10},
		{IDServico: 9, IDMecanico: 4},
		{IDServico: 10, IDMecanico: 4},
	}
	db.Create(&realiza)

	// ── Uso de Peças ──────────────────────────────────────────
	usoPecas := []models.UsoPeca{
		{IDPeca: 1, IDServico: 1, Quantidade: 1, ValorVenda: 48000},
		{IDPeca: 2, IDServico: 2, Quantidade: 1, ValorVenda: 20000},
		{IDPeca: 3, IDServico: 3, Quantidade: 1, ValorVenda: 9500},
		{IDPeca: 8, IDServico: 3, Quantidade: 1, ValorVenda: 4200},
		{IDPeca: 4, IDServico: 6, Quantidade: 4, ValorVenda: 3500},
		{IDPeca: 5, IDServico: 4, Quantidade: 1, ValorVenda: 13500},
		{IDPeca: 6, IDServico: 8, Quantidade: 1, ValorVenda: 6200},
		{IDPeca: 9, IDServico: 5, Quantidade: 4, ValorVenda: 400},
		{IDPeca: 10, IDServico: 5, Quantidade: 8, ValorVenda: 95},
	}
	db.Create(&usoPecas)

	// ── Fornece (N:N peça x fornecedor) ───────────────────────
	fornece := []models.FornecedorPeca{
		{IDPeca: 1, IDFornecedor: 4}, {IDPeca: 2, IDFornecedor: 4},
		{IDPeca: 3, IDFornecedor: 3}, {IDPeca: 4, IDFornecedor: 2},
		{IDPeca: 5, IDFornecedor: 2}, {IDPeca: 6, IDFornecedor: 1},
		{IDPeca: 7, IDFornecedor: 1}, {IDPeca: 8, IDFornecedor: 3},
		{IDPeca: 9, IDFornecedor: 4}, {IDPeca: 10, IDFornecedor: 5},
	}
	db.Create(&fornece)

	// ── Histórico de Projetos (Removido IDVeiculo) ────────────
	historicos := []models.HistoricoProjeto{
		{Status: "Iniciado", Data: "2024-01-10", KMRegistrado: 45000, TipoServico: "Motor", Descricao: "Desmontagem motor original", IDProjeto: 1},
		{Status: "Em andamento", Data: "2024-02-20", KMRegistrado: 45000, TipoServico: "Motor", Descricao: "Motor LS3 instalado", IDProjeto: 1},
		{Status: "Concluído", Data: "2024-04-15", KMRegistrado: 45100, TipoServico: "Motor", Descricao: "Calibração e testes", IDProjeto: 1},
		{Status: "Iniciado", Data: "2024-02-15", KMRegistrado: 32000, TipoServico: "Turbo", Descricao: "Análise motor VW 1600", IDProjeto: 2},
		{Status: "Em andamento", Data: "2024-03-10", KMRegistrado: 32000, TipoServico: "Turbo", Descricao: "Kit turbo em montagem", IDProjeto: 2},
		{Status: "Concluído", Data: "2023-11-01", KMRegistrado: 78000, TipoServico: "Motor", Descricao: "Início rebuild V8", IDProjeto: 3},
		{Status: "Concluído", Data: "2024-02-28", KMRegistrado: 78200, TipoServico: "Motor", Descricao: "Entrega Maverick concluída", IDProjeto: 3},
		{Status: "Iniciado", Data: "2024-03-01", KMRegistrado: 65000, TipoServico: "Turbo 4x4", Descricao: "Início projeto Veraneio", IDProjeto: 4},
		{Status: "Iniciado", Data: "2024-01-20", KMRegistrado: 28000, TipoServico: "Restauração", Descricao: "Desmontagem Brasília", IDProjeto: 5},
		{Status: "Em andamento", Data: "2024-03-05", KMRegistrado: 28000, TipoServico: "Funilaria", Descricao: "Funilaria 80% concluída", IDProjeto: 5},
	}
	db.Create(&historicos)

	// ── Inspeções ─────────────────────────────────────────────
	inspecoes := []models.Inspecao{
		{DataInspecao: "2024-01-15", Tipo: "Pré-projeto", Resultado: "Aprovado", Observacoes: "Motor com desgaste severo", IDMecanico: 1, IDVeiculo: 1},
		{DataInspecao: "2024-04-20", Tipo: "Pós-serviço", Resultado: "Aprovado", Observacoes: "LS3 funcionando perfeitamente", IDMecanico: 1, IDVeiculo: 1},
		{DataInspecao: "2024-02-20", Tipo: "Pré-projeto", Resultado: "Aprovado", Observacoes: "Motor 1600 com folga excessiva", IDMecanico: 5, IDVeiculo: 2},
		{DataInspecao: "2023-11-05", Tipo: "Pré-projeto", Resultado: "Aprovado", Observacoes: "V8 necessita rebuild completo", IDMecanico: 1, IDVeiculo: 3},
		{DataInspecao: "2024-04-30", Tipo: "Final", Resultado: "Aprovado", Observacoes: "Maverick entregue ao cliente", IDMecanico: 2, IDVeiculo: 3},
		{DataInspecao: "2024-03-05", Tipo: "Pré-projeto", Resultado: "Reprovado", Observacoes: "Chassi Veraneio com solda", IDMecanico: 7, IDVeiculo: 4},
		{DataInspecao: "2024-01-25", Tipo: "Pré-projeto", Resultado: "Aprovado", Observacoes: "Brasília em bom estado geral", IDMecanico: 4, IDVeiculo: 5},
		{DataInspecao: "2024-04-10", Tipo: "Pós-serviço", Resultado: "Aprovado", Observacoes: "Funilaria aprovada", IDMecanico: 4, IDVeiculo: 5},
		{DataInspecao: "2024-04-15", Tipo: "Pré-projeto", Resultado: "Aprovado", Observacoes: "Corcel em estado razoável", IDMecanico: 1, IDVeiculo: 6},
		{DataInspecao: "2024-02-10", Tipo: "Pré-projeto", Resultado: "Aprovado", Observacoes: "Chevette motor ok", IDMecanico: 8, IDVeiculo: 7},
	}
	db.Create(&inspecoes)

	c.JSON(200, gin.H{"mensagem": "Banco populado com sucesso!"})
}

func DropBancoDados(c *gin.Context) {
	config.DB.Exec("TRUNCATE TABLE uso_peca, fornece, realiza, inspecao, historico_projeto, servico, upgrade_restomod, projeto, mecanico, veiculo, peca, fornecedor, cliente, oficina RESTART IDENTITY CASCADE")
	c.JSON(200, gin.H{"mensagem": "Todas as tabelas foram limpas!"})
}
