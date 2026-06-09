
-- 1. Tabelas Independentes (Sem Chaves Estrangeiras)
CREATE TABLE oficina (
    id_oficina SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    especialidade VARCHAR(255),
    endereco VARCHAR(100),
    telefone VARCHAR(20)
);

CREATE TABLE cliente (
    id_cliente SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(20),
    email VARCHAR(255),
    endereco VARCHAR(100),
    telefone VARCHAR(20)
);

CREATE TABLE fornecedor (
    id_fornecedor SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    especialidade VARCHAR(255),
    contato VARCHAR(255)
);

CREATE TABLE veiculo (
    id_veiculo SERIAL PRIMARY KEY,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    placa VARCHAR(20),
    chassi VARCHAR(100),
    ano_fabricacao INT,
    status VARCHAR(50),
    categoria VARCHAR(100),
    whp_original INT,
    kgfm_original INT
);

CREATE TABLE peca (
    id_peca SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    fabricante VARCHAR(255),
    origem VARCHAR(100),
    estoque INT DEFAULT 0,
    numero_peca INT,
    preco_referencia DECIMAL(10,2),
    tipo_peca VARCHAR(100)
);

-- 2. Tabelas Dependentes (Com Chaves Estrangeiras)
CREATE TABLE mecanico (
    id_mecanico SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(20),
    especialidade VARCHAR(100),
    nivel VARCHAR(50),
    id_oficina INT REFERENCES oficina(id_oficina)
);

CREATE TABLE projeto (
    id_projeto SERIAL PRIMARY KEY,
    data_inicio DATE,
    titulo VARCHAR(255),
    data_previsao DATE,
    orcamento_total DECIMAL(12,2),
    categoria_projeto VARCHAR(100),
    id_oficina INT REFERENCES oficina(id_oficina),
    id_cliente INT REFERENCES cliente(id_cliente)
);

CREATE TABLE upgrade_restomod (
    id_upgrade_restomod SERIAL PRIMARY KEY,
    sistema_alvo VARCHAR(255),
    veiculo_doador VARCHAR(255),
    descricao_adaptacao VARCHAR(255),
    whp_final INT,
    kgfm_final INT,
    data_upgrade_inicio DATE,
    data_upgrade_fim DATE,
    id_projeto INT REFERENCES projeto(id_projeto) ON DELETE CASCADE
);

CREATE TABLE servico (
    id_servico SERIAL PRIMARY KEY,
    categoria VARCHAR(100),
    descricao VARCHAR(200),
    horas_realizadas DECIMAL(5,2),
    horas_estimadas DECIMAL(5,2),
    valor DECIMAL(10,2),
    id_projeto INT REFERENCES projeto(id_projeto),
    id_upgrade_restomod INT REFERENCES upgrade_restomod(id_upgrade_restomod) ON DELETE SET NULL
);

CREATE TABLE historico_projeto (
    id_historico SERIAL PRIMARY KEY,
    status VARCHAR(100),
    data DATE,
    km_registrado INT,
    tipo_servico VARCHAR(100),
    descricao VARCHAR(200),
    id_projeto INT REFERENCES projeto(id_projeto),
    id_veiculo INT REFERENCES veiculo(id_veiculo)
);

CREATE TABLE inspecao (
    id_inspecao SERIAL PRIMARY KEY,
    data_inspecao DATE,
    tipo VARCHAR(100),
    resultado VARCHAR(255),
    observacoes TEXT,
    id_mecanico INT REFERENCES mecanico(id_mecanico) ON DELETE RESTRICT,
    id_veiculo INT REFERENCES veiculo(id_veiculo) ON DELETE CASCADE
);

-- 3. Tabelas Associativas (Relações N:N)
CREATE TABLE realiza (
    id_servico INT REFERENCES servico(id_servico) ON DELETE CASCADE,
    id_mecanico INT REFERENCES mecanico(id_mecanico) ON DELETE CASCADE,
    PRIMARY KEY (id_servico, id_mecanico)
);

CREATE TABLE fornece (
    id_peca INT REFERENCES peca(id_peca) ON DELETE CASCADE,
    id_fornecedor INT REFERENCES fornecedor(id_fornecedor) ON DELETE CASCADE,
    PRIMARY KEY (id_peca, id_fornecedor)
);

CREATE TABLE uso_peca (
    id_uso_peca SERIAL PRIMARY KEY,
    valor_venda DECIMAL(10,2),
    quantidade INT,
    id_peca INT REFERENCES peca(id_peca) ON DELETE CASCADE,
    id_servico INT REFERENCES servico(id_servico) ON DELETE RESTRICT
);