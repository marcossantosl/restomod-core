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
	IDProjeto        uint      `gorm:"primaryKey;autoIncrement;column:id_projeto" json:"id_projeto"`
	DataInicio       time.Time `gorm:"column:data_inicio"                         json:"data_inicio"`
	DataPrevisao     time.Time `gorm:"column:data_previsao"                       json:"data_previsao"`
	OrcamentoTotal   float64   `gorm:"column:orcamento_total"                     json:"orcamento_total"`
	CategoriaProjeto string    `gorm:"column:categoria_projeto"                   json:"categoria_projeto"`
	IDOficina        uint      `gorm:"column:id_oficina"                          json:"id_oficina"`
	IDCliente        uint      `gorm:"column:id_cliente"                          json:"id_cliente"`
	Oficina          Oficina   `gorm:"foreignKey:IDOficina;references:IDOficina"  json:"oficina,omitempty"`
	Cliente          Cliente   `gorm:"foreignKey:IDCliente;references:IDCliente"  json:"cliente,omitempty"`
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