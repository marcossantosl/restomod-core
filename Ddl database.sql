
-- Criação das Tabelas (DDL)

CREATE TABLE Cliente (
    id_cliente INTEGER PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cpf VARCHAR(14),
    email VARCHAR(100),
    endereco VARCHAR(100),
    telefone VARCHAR(15)
);

CREATE TABLE Oficina (
    id_oficina INTEGER PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cnpj VARCHAR(18),
    especialidade VARCHAR(100),
    endereco VARCHAR(100),
    telefone VARCHAR(15)
);

CREATE TABLE Projeto (
    id_projeto INTEGER PRIMARY KEY,
    data_inicio DATE,
    data_previsao DATE,
    orcamento_total DECIMAL(12,2),
    categoria_projeto VARCHAR(50),
    id_oficina INTEGER,
    id_cliente INTEGER,
    FOREIGN KEY (id_oficina) REFERENCES Oficina(id_oficina),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

CREATE TABLE Upgrade_Restomod (
    id_upgrade_restomod INTEGER PRIMARY KEY,
    sistema_alvo VARCHAR(50),
    veiculo_doador VARCHAR(50),
    descricao_adaptacao VARCHAR(500),
    whp_final INTEGER,
    kgfm_final INTEGER,
    data_upgrade DATE
);

CREATE TABLE Contempla (
    id_upgrade_restomod INTEGER,
    id_projeto INTEGER,
    PRIMARY KEY (id_upgrade_restomod, id_projeto),
    FOREIGN KEY (id_upgrade_restomod) REFERENCES Upgrade_Restomod(id_upgrade_restomod),
    FOREIGN KEY (id_projeto) REFERENCES Projeto(id_projeto)
);

CREATE TABLE Veiculo (
    id_veiculo INTEGER PRIMARY KEY,
    marca VARCHAR(20),
    modelo VARCHAR(20),
    chassi VARCHAR(50),
    ano_fabricacao INTEGER,
    status VARCHAR(20),
    categoria VARCHAR(20),
    whp_original INTEGER,
    kgfm_original INTEGER
);

CREATE TABLE historico_projeto (
    id_historico INTEGER PRIMARY KEY,
    status VARCHAR(20),
    data DATE,
    km_registrado INTEGER,
    tipo_servico VARCHAR(50),
    descricao VARCHAR(500),
    id_projeto INTEGER,
    id_veiculo INTEGER,
    FOREIGN KEY (id_projeto) REFERENCES Projeto(id_projeto),
    FOREIGN KEY (id_veiculo) REFERENCES Veiculo(id_veiculo)
);

CREATE TABLE Mecanico (
    id_mecanico INTEGER PRIMARY KEY,
    nome VARCHAR(50),
    cpf VARCHAR(14),
    especialidade VARCHAR(100),
    nivel VARCHAR(20),
    id_oficina INTEGER,
    FOREIGN KEY (id_oficina) REFERENCES Oficina(id_oficina)
);

CREATE TABLE Inspecao (
    id_inspecao INTEGER PRIMARY KEY,
    data_inspecao DATE,
    tipo VARCHAR(20),
    resultado VARCHAR(500),
    observacoes VARCHAR(100),
    id_mecanico INTEGER,
    id_veiculo INTEGER,
    FOREIGN KEY (id_mecanico) REFERENCES Mecanico(id_mecanico),
    FOREIGN KEY (id_veiculo) REFERENCES Veiculo(id_veiculo)
);

CREATE TABLE Servico (
    id_servico INTEGER PRIMARY KEY,
    horas_realizadas DECIMAL(5,2),
    horas_estimadas DECIMAL(5,2),
    valor DECIMAL(10,2),
    categoria VARCHAR(50),
    descricao VARCHAR(500),
    id_projeto INTEGER,
    FOREIGN KEY (id_projeto) REFERENCES Projeto(id_projeto)
);

CREATE TABLE Realiza (
    id_mecanico INTEGER,
    id_servico INTEGER,
    PRIMARY KEY (id_mecanico, id_servico),
    FOREIGN KEY (id_mecanico) REFERENCES Mecanico(id_mecanico),
    FOREIGN KEY (id_servico) REFERENCES Servico(id_servico)
);

CREATE TABLE Fornecedor (
    id_fornecedor INTEGER PRIMARY KEY,
    contato VARCHAR(50),
    especialidade VARCHAR(100),
    nome VARCHAR(50)
);

CREATE TABLE Peca (
    id_peca INTEGER PRIMARY KEY,
    nome VARCHAR(100),
    fabricante VARCHAR(20),
    origem VARCHAR(20),
    estoque INTEGER,
    numero_peca INTEGER,
    preco_referencia DECIMAL(10,2), -- Renomeado conforme nossa última conversa
    tipo_peca VARCHAR(20)
);

CREATE TABLE fornece (
    id_peca INTEGER,
    id_fornecedor INTEGER,
    PRIMARY KEY (id_peca, id_fornecedor),
    FOREIGN KEY (id_peca) REFERENCES Peca(id_peca),
    FOREIGN KEY (id_fornecedor) REFERENCES Fornecedor(id_fornecedor)
);

CREATE TABLE Uso_Peca (
    id_uso_peca INTEGER PRIMARY KEY,
    valor_venda DECIMAL(10,2), -- O valor histórico cobrado no serviço
    quantidade INTEGER,
    id_peca INTEGER,
    id_servico INTEGER,
    FOREIGN KEY (id_peca) REFERENCES Peca(id_peca),
    FOREIGN KEY (id_servico) REFERENCES Servico(id_servico)
);

SELECT pg_terminate_backend(pid) 
   FROM pg_stat_activity 
   WHERE datname = 'Modelagem de Banco de Dados para Plataforma de Restomod';

   -- Renomeia o banco (o nome atual deve estar entre aspas duplas por causa dos espaços)
   ALTER DATABASE "Modelagem de Banco de Dados para Plataforma de Restomod" RENAME TO oficina_db;