package models

import "time"

type Cliente struct {
	IDCliente uint   `gorm:"primaryKey;autoIncrement;column:id_cliente" json:"id_cliente"`
	Nome      string `gorm:"column:nome;not null"                       json:"nome"`
	CPF       string `gorm:"column:cpf"                                 json:"cpf"`
	Email     string `gorm:"column:email"                               json:"email"`
	Endereco  string `gorm:"column:endereco"                            json:"endereco"`
	Telefone  string `gorm:"column:telefone"                            json:"telefone"`
}

func (Cliente) TableName() string { return "cliente" }

type Oficina struct {
	IDOficina     uint   `gorm:"primaryKey;autoIncrement;column:id_oficina" json:"id_oficina"`
	Nome          string `gorm:"column:nome;not null"                       json:"nome"`
	CNPJ          string `gorm:"column:cnpj"                                json:"cnpj"`
	Especialidade string `gorm:"column:especialidade"                       json:"especialidade"`
	Endereco      string `gorm:"column:endereco"                            json:"endereco"`
	Telefone      string `gorm:"column:telefone"                            json:"telefone"`
}

func (Oficina) TableName() string { return "oficina" }

type Projeto struct {
	IDProjeto        uint    `gorm:"primaryKey;autoIncrement;column:id_projeto" json:"id_projeto"`
	DataInicio       string  `gorm:"column:data_inicio"                         json:"data_inicio"`
	Titulo           string  `gorm:"column:titulo"                              json:"titulo"`
	DataPrevisao     string  `gorm:"column:data_previsao"                       json:"data_previsao"`
	OrcamentoTotal   float64 `gorm:"column:orcamento_total"                     json:"orcamento_total"`
	CategoriaProjeto string  `gorm:"column:categoria_projeto"                   json:"categoria_projeto"`
	IDOficina        uint    `gorm:"column:id_oficina"                          json:"id_oficina"`
	IDCliente        uint    `gorm:"column:id_cliente"                          json:"id_cliente"`
	Oficina          Oficina `gorm:"foreignKey:IDOficina;references:IDOficina"  json:"oficina,omitempty"`
	Cliente          Cliente `gorm:"foreignKey:IDCliente;references:IDCliente"  json:"cliente,omitempty"`
}

func (Projeto) TableName() string { return "projeto" }

type Mecanico struct {
	IDMecanico    uint    `gorm:"primaryKey;autoIncrement;column:id_mecanico" json:"id_mecanico"`
	Nome          string  `gorm:"column:nome"                                 json:"nome"`
	CPF           string  `gorm:"column:cpf"                                  json:"cpf"`
	Especialidade string  `gorm:"column:especialidade"                        json:"especialidade"`
	Nivel         string  `gorm:"column:nivel"                                json:"nivel"`
	IDOficina     uint    `gorm:"column:id_oficina"                           json:"id_oficina"`
	Oficina       Oficina `gorm:"foreignKey:IDOficina;references:IDOficina"   json:"oficina,omitempty"`
}

func (Mecanico) TableName() string { return "mecanico" }

type Servico struct {
	IDServico       uint    `gorm:"primaryKey;autoIncrement;column:id_servico" json:"id_servico"`
	HorasRealizadas float64 `gorm:"column:horas_realizadas"                    json:"horas_realizadas"`
	HorasEstimadas  float64 `gorm:"column:horas_estimadas"                     json:"horas_estimadas"`
	Valor           float64 `gorm:"column:valor"                               json:"valor"`
	Categoria       string  `gorm:"column:categoria"                           json:"categoria"`
	Descricao       string  `gorm:"column:descricao"                           json:"descricao"`
	IDProjeto       uint    `gorm:"column:id_projeto"                          json:"id_projeto"`
	Projeto         Projeto `gorm:"foreignKey:IDProjeto;references:IDProjeto"  json:"projeto,omitempty"`
}

func (Servico) TableName() string { return "servico" }

type Veiculo struct {
	IDVeiculo     uint   `gorm:"primaryKey;autoIncrement;column:id_veiculo" json:"id_veiculo"`
	Marca         string `gorm:"column:marca"                               json:"marca"`
	Modelo        string `gorm:"column:modelo"                              json:"modelo"`
	Chassi        string `gorm:"column:chassi"                              json:"chassi"`
	AnoFabricacao int    `gorm:"column:ano_fabricacao"                      json:"ano_fabricacao"`
	Status        string `gorm:"column:status"                              json:"status"`
	Categoria     string `gorm:"column:categoria"                           json:"categoria"`
	WHPOriginal   int    `gorm:"column:whp_original"                        json:"whp_original"`
	KGFMOriginal  int    `gorm:"column:kgfm_original"                       json:"kgfm_original"`
}

func (Veiculo) TableName() string { return "veiculo" }

type Peca struct {
	IDPeca          uint    `gorm:"primaryKey;autoIncrement;column:id_peca"    json:"id_peca"`
	Nome            string  `gorm:"column:nome"                                json:"nome"`
	Fabricante      string  `gorm:"column:fabricante"                          json:"fabricante"`
	Origem          string  `gorm:"column:origem"                              json:"origem"`
	Estoque         int     `gorm:"column:estoque"                             json:"estoque"`
	NumeroPeca      int     `gorm:"column:numero_peca"                         json:"numero_peca"`
	PrecoReferencia float64 `gorm:"column:preco_referencia"                    json:"preco_referencia"`
	TipoPeca        string  `gorm:"column:tipo_peca"                           json:"tipo_peca"`
}

func (Peca) TableName() string { return "peca" }

type Fornecedor struct {
	IDFornecedor  uint   `gorm:"primaryKey;autoIncrement;column:id_fornecedor"   json:"id_fornecedor"`
	Nome          string `gorm:"column:nome"                                     json:"nome"`
	Especialidade string `gorm:"column:especialidade" 						     json:"especialidade"`
	Contato       string `gorm:"column:contato"                                  json:"contato"`
}

func (Fornecedor) TableName() string { return "fornecedor" }

type HistoricoProjeto struct {
	IDHistoricoProjeto uint      `gorm:"primaryKey;autoIncrement;column:id_fornecedor" json:"id_historico"`
	Status             string    `gorm:"column:status"                                  json:"status"`
	Data               time.Time `gorm:"column:data"                                   json:"data"`
	KMRegistrado       int       `gorm:"column:km_registrado"                          json:"km_registrado"`
	TipoServico        string    `gorm:"column:tipo_servico"                           json:"tipo_servico"`
	Descricao          string    `gorm:"column:descricao"                              json:"descricao"`
	IDProjeto          uint      `gorm:"column:id_projeto"                             json:"id_projeto"`
	Projeto            Projeto   `gorm:"foreignKey:IDProjeto;references:IDProjeto"     json:"oficina,omitempty"`
	IDVeiculo          uint      `gorm:"column:id_veiculo"                             json:"id_veiculo"`
	Veiculo            Veiculo   `gorm:"foreignKey:IDVeiculo;references:IDVeiculo"     json:"veiculo,omitempty"`
}

func (HistoricoProjeto) TableName() string { return "historico_projeto" }

type UsoPeca struct {
	IDUsoPeca  uint    `gorm:"primaryKey;autoIncrement;column:id_uso_peca"   json:"id_uso_peca"`
	ValorVenda int     `gorm:"column:valor_venda"                            json:"valor_venda"`
	Quantidade int     `gorm:"column:quantidade"                             json:"quantidade"`
	IDPeca     uint    `gorm:"column:id_peca"                                json:"id_peca"`
	Peca       Peca    `gorm:"foreignKey:IDPeca;references:IDPeca"           json:"peca,omitempty"`
	IDServico  uint    `gorm:"column:id_servico"                             json:"id_servico"`
	Servico    Servico `gorm:"foreignKey:IDServico;references:IDServico"     json:"servico,omitempty"`
}

func (UsoPeca) TableName() string { return "uso_peca" }

type MecanicoServico struct {
	IDServico  uint     `gorm:"column:id_servico"                             json:"id_servico"`
	Servico    Servico  `gorm:"foreignKey:IDServico;references:IDServico"     json:"servico,omitempty"`
	IDMecanico uint     `gorm:"column:id_mecanico"                            json:"id_mecanico"`
	Mecanico   Mecanico `gorm:"foreignKey:IDMecanico;references:IDMecanico"   json:"mecanico,omitempty"`
}

func (MecanicoServico) TableName() string { return "realiza" }

type UpgradeRestomod struct {
	IDUpgradeRestomod  uint      `gorm:"foreignKey;autoIncrement;column:id_upgrade_restomod"         json:"id_upgrade_restomod"`
	SistemaAlvo        string    `gorm:"column:sistema_alvo"                                         json:"sistema_alvo"`
	VeiculoDoador      string    `gorm:"column:veiculo_doador"                                       json:"veiculo_doador"`
	DescricaoAdaptacao string    `gorm:"column:descricao_adaptacao"                                  json:"descricao_adaptacao"`
	WHPFinal           string    `gorm:"column:whp_final"                                            json:"whp_final"`
	KGFMFinal          string    `gorm:"column:kgfm_final"                                           json:"kgfm_final"`
	DataUpgrade        time.Time `gorm:"column:data_upgrade"                                         json:"data_upgrade"`
}

func (UpgradeRestomod) TableName() string { return "upgrade_restomod" }

type UpgradeProjeto struct {
	IDUpgradeRestomod uint            `gorm:"column:id_upgrade_restomod"                                       json:"id_upgrade_restomod"`
	UpgradeRestomod   UpgradeRestomod `gorm:"foreignKey:IDUpgradeRestomod;references:IDUpgradeRestomod"        json:"upgrade_restomod,omitempty"`
	IDProjeto         uint            `gorm:"column:id_projeto"                                                json:"id_projeto"`
	Projeto           Projeto         `gorm:"foreignKey:IDProjeto;references:IDProjeto"                        json:"oficina,omitempty"`
}

func (UpgradeProjeto) TableName() string { return "contempla" }

type FornecedorPeca struct {
	IDPeca       uint       `gorm:"column:id_peca"                                  json:"id_peca"`
	Peca         Peca       `gorm	:"foreignKey:IDPeca;references:IDPeca"             json:"peca,omitempty"`
	IDFornecedor uint       `gorm:"column:id_fornecedor"                            json:"id_fornecedor"`
	Fornecedor   Fornecedor `gorm:"foreignKey:IDFornecedor;references:IDFornecedor"  json:"fornecedor,omitempty"`
}

func (FornecedorPeca) Tables() string { return "fornece" }

type Inspecao struct {
	IDInspecao   uint      `gorm:"column:id_inspecao"                            json:"id_inspecao"`
	DataInspecao time.Time `gorm:"column:data_inspecao"                          json:"data_inspecao"`
	Tipo         string    `gorm:"column:tipo"                                   json:"tipo"`
	Resultado    string    `gorm:"column:resultado"                              json:"resultado"`
	Observacoes  string    `gorm:"column:observacoes"                           json:"observacoes"`
	IDMecanico   uint      `gorm:"column:id_mecanico"                            json:"id_mecanico"`
	Mecanico     Mecanico  `gorm:"foreignKey:IDMecanico;references:IDMecanico"   json:"mecanico,omitempty"`
	IDVeiculo    uint      `gorm:"column:id_veiculo"                             json:"id_veiculo"`
	Veiculo      Veiculo   `gorm:"foreignKey:IDVeiculo;references:IDVeiculo"     json:"veiculo,omitempty"`
}
