package models

import "time"

// 1. Cliente (Independente no DDL)
type Cliente struct {
	IDCliente uint `gorm:"primaryKey;autoIncrement;column:id_cliente" json:"id_cliente"`
	Nome      string `gorm:"column:nome;not null"`
	CPF       string `gorm:"column:cpf"`
	Email     string `gorm:"column:email"`
	Endereco  string `gorm:"column:endereco"`
	Telefone  string `gorm:"column:telefone"`
	
}

func (Cliente) TableName() string { return "cliente" }

// 2. Oficina (Independente no DDL)
type Oficina struct {
	IDOficina     uint   `gorm:"primaryKey;autoIncrement;column:id_oficina"`
	Nome          string `gorm:"column:nome;not null"`
	CNPJ          string `gorm:"column:cnpj"`
	Especialidade string `gorm:"column:especialidade"`
	Endereco      string `gorm:"column:endereco"`
	Telefone      string `gorm:"column:telefone"`
}

func (Oficina) TableName() string { return "oficina" }

// 3. Projeto (REFERENCIA: Oficina e Cliente)
type Projeto struct {
	IDProjeto        uint      `gorm:"primaryKey;autoIncrement;column:id_projeto"`
	DataInicio       time.Time `gorm:"column:data_inicio"`
	DataPrevisao     time.Time `gorm:"column:data_previsao"`
	OrcamentoTotal   float64   `gorm:"column:orcamento_total"`
	CategoriaProjeto string    `gorm:"column:categoria_projeto"`
	IDOficina        uint      `gorm:"column:id_oficina"`
	IDCliente        uint      `gorm:"column:id_cliente"`
	// Relacionamentos para o GORM entender as FKs do seu DDL
	Oficina          Oficina   `gorm:"foreignKey:IDOficina;references:IDOficina"`
	Cliente          Cliente   `gorm:"foreignKey:IDCliente;references:IDCliente"`
}

func (Projeto) TableName() string { return "projeto" }

// 4. Mecanico (REFERENCIA: Oficina)
type Mecanico struct {
	IDMecanico    uint    `gorm:"primaryKey;autoIncrement;column:id_mecanico"`
	Nome          string  `gorm:"column:nome"`
	CPF           string  `gorm:"column:cpf"`
	Especialidade string  `gorm:"column:especialidade"`
	Nivel         string  `gorm:"column:nivel"`
	IDOficina     uint    `gorm:"column:id_oficina"`
	Oficina       Oficina `gorm:"foreignKey:IDOficina;references:IDOficina"`
}

func (Mecanico) TableName() string { return "mecanico" }

// 5. Servico (REFERENCIA: Projeto)
type Servico struct {
	IDServico       uint    `gorm:"primaryKey;autoIncrement;column:id_servico"`
	HorasRealizadas float64 `gorm:"column:horas_realizadas"`
	HorasEstimadas  float64 `gorm:"column:horas_estimadas"`
	Valor           float64 `gorm:"column:valor"`
	Categoria       string  `gorm:"column:categoria"`
	Descricao       string  `gorm:"column:descricao"`
	IDProjeto       uint    `gorm:"column:id_projeto"`
	Projeto         Projeto `gorm:"foreignKey:IDProjeto;references:IDProjeto"`
}

func (Servico) TableName() string { return "servico" }

// 6. Veiculo (Independente no DDL)
type Veiculo struct {
	IDVeiculo     uint   `gorm:"primaryKey;autoIncrement;column:id_veiculo"`
	Marca         string `gorm:"column:marca"`
	Modelo        string `gorm:"column:modelo"`
	Chassi        string `gorm:"column:chassi"`
	AnoFabricacao int    `gorm:"column:ano_fabricacao"`
	Status        string `gorm:"column:status"`
	Categoria     string `gorm:"column:categoria"`
	WHPOriginal   int    `gorm:"column:whp_original"`
	KGFMOriginal  int    `gorm:"column:kgfm_original"`
}

func (Veiculo) TableName() string { return "veiculo" }

// 7. Peca (Independente no DDL)
type Peca struct {
	IDPeca          uint    `gorm:"primaryKey;autoIncrement;column:id_peca"`
	Nome            string  `gorm:"column:nome"`
	Fabricante      string  `gorm:"column:fabricante"`
	Origem          string  `gorm:"column:origem"`
	Estoque         int     `gorm:"column:estoque"`
	NumeroPeca      int     `gorm:"column:numero_peca"`
	PrecoReferencia float64 `gorm:"column:preco_referencia"`
	TipoPeca        string  `gorm:"column:tipo_peca"`
}

func (Peca) TableName() string { return "peca" }