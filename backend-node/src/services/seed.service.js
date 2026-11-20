const prisma = require('../database/prisma');

const TABELAS_EM_ORDEM = [
  'uso_peca',
  'fornece',
  'realiza',
  'inspecao',
  'historico_projeto',
  'servico',
  'upgrade_restomod',
  'projeto',
  'mecanico',
  'veiculo',
  'peca',
  'fornecedor',
  'cliente',
  'oficina',
];

async function limpar() {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${TABELAS_EM_ORDEM.join(', ')} RESTART IDENTITY CASCADE`
  );
}

// Insere em sequência (em vez de createMany) para preservar a ordem de geração
// dos IDs seriais e evitar um bug conhecido do engine do Prisma 5.x ao combinar
// createMany com colunas Decimal/Date anuláveis na mesma tabela.
async function criarTodos(delegate, data) {
  for (const item of data) {
    await delegate.create({ data: item });
  }
}

async function popular() {
  await limpar();

  await criarTodos(prisma.oficina, [
      { nome: 'Garage Restomod SP', cnpj: '11.222.333/0001-44', especialidade: 'Restomod e Preparação', endereco: 'Rua das Oficinas, 100 - SP', telefone: '(11) 91111-1111' },
      { nome: 'Classic Motorsport RJ', cnpj: '22.333.444/0001-55', especialidade: 'Restauração Clássicos', endereco: 'Av. Brasil, 500 - RJ', telefone: '(21) 92222-2222' },
      { nome: 'Turbo Performance BH', cnpj: '33.444.555/0001-66', especialidade: 'Motor e Turbo', endereco: 'Rua Minas, 200 - BH', telefone: '(31) 93333-3333' },
    ]);

  await criarTodos(prisma.cliente, [
      { nome: 'Carlos Mendes', cpf: '111.222.333-01', email: 'carlos@email.com', endereco: 'Rua A, 10', telefone: '(11) 91001-0001' },
      { nome: 'Ana Souza', cpf: '111.222.333-02', email: 'ana@email.com', endereco: 'Rua B, 20', telefone: '(11) 91001-0002' },
      { nome: 'Roberto Lima', cpf: '111.222.333-03', email: 'roberto@email.com', endereco: 'Rua C, 30', telefone: '(21) 91001-0003' },
      { nome: 'Fernanda Costa', cpf: '111.222.333-04', email: 'fernanda@email.com', endereco: 'Rua D, 40', telefone: '(21) 91001-0004' },
      { nome: 'Marcelo Vieira', cpf: '111.222.333-05', email: 'marcelo@email.com', endereco: 'Rua E, 50', telefone: '(31) 91001-0005' },
      { nome: 'Juliana Alves', cpf: '111.222.333-06', email: 'juliana@email.com', endereco: 'Rua F, 60', telefone: '(31) 91001-0006' },
      { nome: 'Paulo Rodrigues', cpf: '111.222.333-07', email: 'paulo@email.com', endereco: 'Rua G, 70', telefone: '(11) 91001-0007' },
      { nome: 'Camila Ferreira', cpf: '111.222.333-08', email: 'camila@email.com', endereco: 'Rua H, 80', telefone: '(11) 91001-0008' },
      { nome: 'André Nascimento', cpf: '111.222.333-09', email: 'andre@email.com', endereco: 'Rua I, 90', telefone: '(21) 91001-0009' },
      { nome: 'Lucia Barbosa', cpf: '111.222.333-10', email: 'lucia@email.com', endereco: 'Rua J, 100', telefone: '(31) 91001-0010' },
    ]);

  await criarTodos(prisma.fornecedor, [
      { nome: 'Magneti Marelli BR', especialidade: 'Injeção e Eletrônica', contato: 'vendas@magneti.com.br' },
      { nome: 'Bosch Peças', especialidade: 'Freios e Suspensão', contato: 'vendas@bosch.com.br' },
      { nome: 'Garrett Turbos Brasil', especialidade: 'Turbinas e Compressores', contato: 'contato@garrett.com.br' },
      { nome: 'ACL Bronzinas', especialidade: 'Motor e Interno', contato: 'vendas@acl.com.br' },
      { nome: 'NGK Velas', especialidade: 'Ignição', contato: 'contato@ngk.com.br' },
    ]);

  await criarTodos(prisma.veiculo, [
      { marca: 'Chevrolet', modelo: 'Opala 2500', placa: 'ABC-1234', chassi: '9BW12345678', anoFabricacao: 1975, status: 'Em restauração', categoria: 'Restomod', whpOriginal: 85, kgfmOriginal: 17, idCliente: 1 },
      { marca: 'Volkswagen', modelo: 'Fusca 1300', placa: 'DEF-5678', chassi: '9BW87654321', anoFabricacao: 1972, status: 'Em restauração', categoria: 'Clássico', whpOriginal: 40, kgfmOriginal: 8, idCliente: 2 },
      { marca: 'Ford', modelo: 'Maverick V8', placa: 'GHI-9012', chassi: '9BF11122233', anoFabricacao: 1977, status: 'Concluído', categoria: 'Restomod', whpOriginal: 120, kgfmOriginal: 22, idCliente: 3 },
      { marca: 'Chevrolet', modelo: 'Veraneio', placa: 'JKL-3456', chassi: '9BW44455566', anoFabricacao: 1980, status: 'Em restauração', categoria: 'Restomod', whpOriginal: 95, kgfmOriginal: 20, idCliente: 4 },
      { marca: 'Volkswagen', modelo: 'Brasília', placa: 'MNO-7890', chassi: '9BW77788899', anoFabricacao: 1978, status: 'Aguardando', categoria: 'Clássico', whpOriginal: 45, kgfmOriginal: 9, idCliente: 5 },
      { marca: 'Ford', modelo: 'Corcel II', placa: 'PQR-1234', chassi: '9BF00011122', anoFabricacao: 1979, status: 'Em restauração', categoria: 'Restomod', whpOriginal: 75, kgfmOriginal: 14, idCliente: 6 },
      { marca: 'Chevrolet', modelo: 'Chevette SR', placa: 'STU-5678', chassi: '9BW33344455', anoFabricacao: 1982, status: 'Concluído', categoria: 'Restomod', whpOriginal: 65, kgfmOriginal: 12, idCliente: 7 },
      { marca: 'Volkswagen', modelo: 'SP2', placa: 'VWX-9012', chassi: '9BW66677788', anoFabricacao: 1974, status: 'Em restauração', categoria: 'Clássico', whpOriginal: 65, kgfmOriginal: 13, idCliente: 8 },
      { marca: 'Ford', modelo: 'Galaxie 500', placa: 'YZA-3456', chassi: '9BF99900011', anoFabricacao: 1971, status: 'Concluído', categoria: 'Restomod', whpOriginal: 140, kgfmOriginal: 28, idCliente: 9 },
      { marca: 'Dodge', modelo: 'Charger RT', placa: 'BCD-7890', chassi: '9BD22233344', anoFabricacao: 1976, status: 'Aguardando', categoria: 'Restomod', whpOriginal: 130, kgfmOriginal: 25, idCliente: 10 },
    ]);

  await criarTodos(prisma.peca, [
      { nome: 'Motor LS3 6.2 V8 GM', fabricante: 'General Motors', origem: 'EUA', estoque: 3, numeroPeca: 1001, precoReferencia: 45000, tipoPeca: 'Motor' },
      { nome: 'Câmbio T56 6 Marchas', fabricante: 'Tremec', origem: 'EUA', estoque: 5, numeroPeca: 1002, precoReferencia: 18000, tipoPeca: 'Transmissão' },
      { nome: 'Turbina Garrett GT3582', fabricante: 'Garrett', origem: 'EUA', estoque: 4, numeroPeca: 1003, precoReferencia: 8500, tipoPeca: 'Turbo' },
      { nome: 'Freio a Disco Wilwood 330mm', fabricante: 'Wilwood', origem: 'EUA', estoque: 8, numeroPeca: 1004, precoReferencia: 3200, tipoPeca: 'Freio' },
      { nome: 'Suspensão Coilover KW V3', fabricante: 'KW', origem: 'Alemanha', estoque: 6, numeroPeca: 1005, precoReferencia: 12000, tipoPeca: 'Suspensão' },
      { nome: 'Injeção Eletrônica Holley', fabricante: 'Holley', origem: 'EUA', estoque: 10, numeroPeca: 1006, precoReferencia: 5500, tipoPeca: 'Injeção' },
      { nome: 'Escapamento Inox Mandrilado', fabricante: 'Borla', origem: 'EUA', estoque: 15, numeroPeca: 1007, precoReferencia: 2800, tipoPeca: 'Escape' },
      { nome: 'Intercooler Front Mount', fabricante: 'Mishimoto', origem: 'EUA', estoque: 7, numeroPeca: 1008, precoReferencia: 3600, tipoPeca: 'Resfriamento' },
      { nome: 'Bronzinas Motor ACL', fabricante: 'ACL', origem: 'Brasil', estoque: 50, numeroPeca: 1009, precoReferencia: 350, tipoPeca: 'Motor' },
      { nome: 'Velas NGK Iridium', fabricante: 'NGK', origem: 'Japão', estoque: 100, numeroPeca: 1010, precoReferencia: 85, tipoPeca: 'Ignição' },
    ]);

  await criarTodos(prisma.mecanico, [
      { nome: 'Ricardo Souza', cpf: '222.333.444-01', especialidade: 'Motor e Preparação', nivel: 'Sênior', idOficina: 1 },
      { nome: 'Diego Martins', cpf: '222.333.444-02', especialidade: 'Suspensão e Freios', nivel: 'Pleno', idOficina: 1 },
      { nome: 'Thiago Oliveira', cpf: '222.333.444-03', especialidade: 'Elétrica e Injeção', nivel: 'Sênior', idOficina: 1 },
      { nome: 'Lucas Pereira', cpf: '222.333.444-04', especialidade: 'Funilaria e Pintura', nivel: 'Pleno', idOficina: 2 },
      { nome: 'Gabriel Santos', cpf: '222.333.444-05', especialidade: 'Motor e Turbo', nivel: 'Sênior', idOficina: 2 },
      { nome: 'Felipe Carvalho', cpf: '222.333.444-06', especialidade: 'Transmissão', nivel: 'Júnior', idOficina: 2 },
      { nome: 'Mateus Costa', cpf: '222.333.444-07', especialidade: 'Motor e Preparação', nivel: 'Sênior', idOficina: 3 },
      { nome: 'Bruno Almeida', cpf: '222.333.444-08', especialidade: 'Turbo e Injeção', nivel: 'Pleno', idOficina: 3 },
      { nome: 'Henrique Lima', cpf: '222.333.444-09', especialidade: 'Suspensão', nivel: 'Júnior', idOficina: 3 },
      { nome: 'Eduardo Ribeiro', cpf: '222.333.444-10', especialidade: 'Elétrica Geral', nivel: 'Pleno', idOficina: 1 },
    ]);

  await criarTodos(prisma.projeto, [
      { titulo: 'Opala LS Swap', dataInicio: '2024-01-10', dataPrevisao: '2024-06-30', orcamentoTotal: 85000, categoriaProjeto: 'LS Swap', idOficina: 1, idCliente: 1, idVeiculo: 1 },
      { titulo: 'Fusca Turbo', dataInicio: '2024-02-15', dataPrevisao: '2024-08-15', orcamentoTotal: 35000, categoriaProjeto: 'Turbo', idOficina: 2, idCliente: 2, idVeiculo: 2 },
      { titulo: 'Maverick V8 Restomod', dataInicio: '2023-11-01', dataPrevisao: '2024-04-30', orcamentoTotal: 120000, categoriaProjeto: 'Restomod', idOficina: 1, idCliente: 3, idVeiculo: 3 },
      { titulo: 'Veraneio 4x4 Turbo', dataInicio: '2024-03-01', dataPrevisao: '2024-10-01', orcamentoTotal: 95000, categoriaProjeto: 'Turbo 4x4', idOficina: 3, idCliente: 4, idVeiculo: 4 },
      { titulo: 'Brasília Restauração', dataInicio: '2024-01-20', dataPrevisao: '2024-05-20', orcamentoTotal: 18000, categoriaProjeto: 'Restauração', idOficina: 2, idCliente: 5, idVeiculo: 5 },
      { titulo: 'Corcel II Restomod', dataInicio: '2024-04-01', dataPrevisao: '2024-09-01', orcamentoTotal: 42000, categoriaProjeto: 'Restomod', idOficina: 1, idCliente: 6, idVeiculo: 6 },
      { titulo: 'Chevette Turbo', dataInicio: '2024-02-01', dataPrevisao: '2024-07-01', orcamentoTotal: 28000, categoriaProjeto: 'Turbo', idOficina: 3, idCliente: 7, idVeiculo: 7 },
      { titulo: 'SP2 Restauração Total', dataInicio: '2023-12-01', dataPrevisao: '2024-06-01', orcamentoTotal: 55000, categoriaProjeto: 'Restauração', idOficina: 2, idCliente: 8, idVeiculo: 8 },
      { titulo: 'Galaxie 500 Restomod', dataInicio: '2024-01-05', dataPrevisao: '2024-12-05', orcamentoTotal: 150000, categoriaProjeto: 'Restomod V8', idOficina: 1, idCliente: 9, idVeiculo: 9 },
      { titulo: 'Charger RT Preparação', dataInicio: '2024-03-15', dataPrevisao: '2024-11-15', orcamentoTotal: 110000, categoriaProjeto: 'Preparação', idOficina: 3, idCliente: 10, idVeiculo: 10 },
    ]);

  await criarTodos(prisma.upgradeRestomod, [
      { sistemaAlvo: 'Motor', veiculoDoador: 'Corvette C6', descricaoAdaptacao: 'Swap LS3 com adaptadores nacionais', whpFinal: 430, kgfmFinal: 59, dataUpgradeInicio: '2024-02-01', dataUpgradeFim: '2024-06-15', idProjeto: 1 },
      { sistemaAlvo: 'Turbo', veiculoDoador: 'Golf GTI Mk5', descricaoAdaptacao: 'Turbo Garrett adaptado VW 1600', whpFinal: 180, kgfmFinal: 28, dataUpgradeInicio: '2024-03-10', dataUpgradeFim: '2024-08-01', idProjeto: 2 },
      { sistemaAlvo: 'Motor', veiculoDoador: 'Mustang GT', descricaoAdaptacao: 'Rebuild V8 FE com peças forjadas', whpFinal: 320, kgfmFinal: 45, dataUpgradeInicio: '2023-11-15', dataUpgradeFim: '2024-04-10', idProjeto: 3 },
      { sistemaAlvo: 'Turbo+4x4', veiculoDoador: 'Patrol Y60', descricaoAdaptacao: 'Turbo e caixa transfer Patrol', whpFinal: 280, kgfmFinal: 52, dataUpgradeInicio: '2024-04-01', dataUpgradeFim: '2024-09-20', idProjeto: 4 },
      { sistemaAlvo: 'Motor', veiculoDoador: 'Golf GTI', descricaoAdaptacao: 'Motor 2.0 8v preparado', whpFinal: 140, kgfmFinal: 22, dataUpgradeInicio: '2024-05-01', dataUpgradeFim: '2024-08-20', idProjeto: 6 },
      { sistemaAlvo: 'Turbo', veiculoDoador: 'Gol GTI', descricaoAdaptacao: 'Turbo AP 2.0 com injeção', whpFinal: 220, kgfmFinal: 35, dataUpgradeInicio: '2024-03-01', dataUpgradeFim: '2024-06-25', idProjeto: 7 },
      { sistemaAlvo: 'Motor', veiculoDoador: 'F-100', descricaoAdaptacao: 'Swap FE 428 original Ford', whpFinal: 390, kgfmFinal: 65, dataUpgradeInicio: '2024-02-15', dataUpgradeFim: '2024-11-30', idProjeto: 9 },
      { sistemaAlvo: 'Motor', veiculoDoador: 'Charger Daytona', descricaoAdaptacao: 'Motor Hemi 440 preparado', whpFinal: 480, kgfmFinal: 72, dataUpgradeInicio: '2024-04-10', dataUpgradeFim: '2024-11-01', idProjeto: 10 },
    ]);

  await criarTodos(prisma.servico, [
      { categoria: 'Motor', descricao: 'Swap motor LS3', horasEstimadas: 80, horasRealizadas: 75, valor: 12000, idProjeto: 1, idUpgradeRestomod: 1 },
      { categoria: 'Transmissão', descricao: 'Instalação câmbio T56', horasEstimadas: 20, horasRealizadas: 22, valor: 3500, idProjeto: 1, idUpgradeRestomod: 1 },
      { categoria: 'Turbo', descricao: 'Kit turbo completo', horasEstimadas: 40, horasRealizadas: 38, valor: 6000, idProjeto: 2, idUpgradeRestomod: 2 },
      { categoria: 'Suspensão', descricao: 'Coilover e geometria', horasEstimadas: 16, horasRealizadas: 18, valor: 2800, idProjeto: 2 },
      { categoria: 'Motor', descricao: 'Rebuild motor V8 Ford', horasEstimadas: 60, horasRealizadas: 58, valor: 9500, idProjeto: 3, idUpgradeRestomod: 3 },
      { categoria: 'Freios', descricao: 'Freios Wilwood 4 pistões', horasEstimadas: 12, horasRealizadas: 10, valor: 4200, idProjeto: 3 },
      { categoria: 'Motor', descricao: 'Turbo e intercooler', horasEstimadas: 50, horasRealizadas: 55, valor: 8000, idProjeto: 4, idUpgradeRestomod: 4 },
      { categoria: 'Elétrica', descricao: 'Injeção eletrônica completa', horasEstimadas: 30, horasRealizadas: 28, valor: 4500, idProjeto: 4 },
      { categoria: 'Funilaria', descricao: 'Restauração carroceria', horasEstimadas: 100, horasRealizadas: 95, valor: 15000, idProjeto: 5 },
      { categoria: 'Pintura', descricao: 'Pintura original restaurada', horasEstimadas: 60, horasRealizadas: 65, valor: 8000, idProjeto: 5 },
    ]);

  await criarTodos(prisma.mecanicoServico, [
      { idServico: 1, idMecanico: 1 }, { idServico: 1, idMecanico: 3 },
      { idServico: 2, idMecanico: 1 }, { idServico: 2, idMecanico: 6 },
      { idServico: 3, idMecanico: 5 }, { idServico: 3, idMecanico: 8 },
      { idServico: 4, idMecanico: 2 }, { idServico: 4, idMecanico: 9 },
      { idServico: 5, idMecanico: 1 }, { idServico: 5, idMecanico: 7 },
      { idServico: 6, idMecanico: 2 },
      { idServico: 7, idMecanico: 7 }, { idServico: 7, idMecanico: 8 },
      { idServico: 8, idMecanico: 3 }, { idServico: 8, idMecanico: 10 },
      { idServico: 9, idMecanico: 4 },
      { idServico: 10, idMecanico: 4 },
    ]);

  await criarTodos(prisma.usoPeca, [
      { idPeca: 1, idServico: 1, quantidade: 1, valorVenda: 48000 },
      { idPeca: 2, idServico: 2, quantidade: 1, valorVenda: 20000 },
      { idPeca: 3, idServico: 3, quantidade: 1, valorVenda: 9500 },
      { idPeca: 8, idServico: 3, quantidade: 1, valorVenda: 4200 },
      { idPeca: 4, idServico: 6, quantidade: 4, valorVenda: 3500 },
      { idPeca: 5, idServico: 4, quantidade: 1, valorVenda: 13500 },
      { idPeca: 6, idServico: 8, quantidade: 1, valorVenda: 6200 },
      { idPeca: 9, idServico: 5, quantidade: 4, valorVenda: 400 },
      { idPeca: 10, idServico: 5, quantidade: 8, valorVenda: 95 },
    ]);

  await criarTodos(prisma.fornecedorPeca, [
      { idPeca: 1, idFornecedor: 4 }, { idPeca: 2, idFornecedor: 4 },
      { idPeca: 3, idFornecedor: 3 }, { idPeca: 4, idFornecedor: 2 },
      { idPeca: 5, idFornecedor: 2 }, { idPeca: 6, idFornecedor: 1 },
      { idPeca: 7, idFornecedor: 1 }, { idPeca: 8, idFornecedor: 3 },
      { idPeca: 9, idFornecedor: 4 }, { idPeca: 10, idFornecedor: 5 },
    ]);

  await criarTodos(prisma.historicoProjeto, [
      { status: 'Iniciado', data: '2024-01-10', kmRegistrado: 45000, tipoServico: 'Motor', descricao: 'Desmontagem motor original', idProjeto: 1 },
      { status: 'Em andamento', data: '2024-02-20', kmRegistrado: 45000, tipoServico: 'Motor', descricao: 'Motor LS3 instalado', idProjeto: 1 },
      { status: 'Concluído', data: '2024-04-15', kmRegistrado: 45100, tipoServico: 'Motor', descricao: 'Calibração e testes', idProjeto: 1 },
      { status: 'Iniciado', data: '2024-02-15', kmRegistrado: 32000, tipoServico: 'Turbo', descricao: 'Análise motor VW 1600', idProjeto: 2 },
      { status: 'Em andamento', data: '2024-03-10', kmRegistrado: 32000, tipoServico: 'Turbo', descricao: 'Kit turbo em montagem', idProjeto: 2 },
      { status: 'Concluído', data: '2023-11-01', kmRegistrado: 78000, tipoServico: 'Motor', descricao: 'Início rebuild V8', idProjeto: 3 },
      { status: 'Concluído', data: '2024-02-28', kmRegistrado: 78200, tipoServico: 'Motor', descricao: 'Entrega Maverick concluída', idProjeto: 3 },
      { status: 'Iniciado', data: '2024-03-01', kmRegistrado: 65000, tipoServico: 'Turbo 4x4', descricao: 'Início projeto Veraneio', idProjeto: 4 },
      { status: 'Iniciado', data: '2024-01-20', kmRegistrado: 28000, tipoServico: 'Restauração', descricao: 'Desmontagem Brasília', idProjeto: 5 },
      { status: 'Em andamento', data: '2024-03-05', kmRegistrado: 28000, tipoServico: 'Funilaria', descricao: 'Funilaria 80% concluída', idProjeto: 5 },
    ]);

  await criarTodos(prisma.inspecao, [
      { dataInspecao: '2024-01-15', tipo: 'Pré-projeto', resultado: 'Aprovado', observacoes: 'Motor com desgaste severo', idMecanico: 1, idVeiculo: 1 },
      { dataInspecao: '2024-04-20', tipo: 'Pós-serviço', resultado: 'Aprovado', observacoes: 'LS3 funcionando perfeitamente', idMecanico: 1, idVeiculo: 1 },
      { dataInspecao: '2024-02-20', tipo: 'Pré-projeto', resultado: 'Aprovado', observacoes: 'Motor 1600 com folga excessiva', idMecanico: 5, idVeiculo: 2 },
      { dataInspecao: '2023-11-05', tipo: 'Pré-projeto', resultado: 'Aprovado', observacoes: 'V8 necessita rebuild completo', idMecanico: 1, idVeiculo: 3 },
      { dataInspecao: '2024-04-30', tipo: 'Final', resultado: 'Aprovado', observacoes: 'Maverick entregue ao cliente', idMecanico: 2, idVeiculo: 3 },
      { dataInspecao: '2024-03-05', tipo: 'Pré-projeto', resultado: 'Reprovado', observacoes: 'Chassi Veraneio com solda', idMecanico: 7, idVeiculo: 4 },
      { dataInspecao: '2024-01-25', tipo: 'Pré-projeto', resultado: 'Aprovado', observacoes: 'Brasília em bom estado geral', idMecanico: 4, idVeiculo: 5 },
      { dataInspecao: '2024-04-10', tipo: 'Pós-serviço', resultado: 'Aprovado', observacoes: 'Funilaria aprovada', idMecanico: 4, idVeiculo: 5 },
      { dataInspecao: '2024-04-15', tipo: 'Pré-projeto', resultado: 'Aprovado', observacoes: 'Corcel em estado razoável', idMecanico: 1, idVeiculo: 6 },
      { dataInspecao: '2024-02-10', tipo: 'Pré-projeto', resultado: 'Aprovado', observacoes: 'Chevette motor ok', idMecanico: 8, idVeiculo: 7 },
    ]);
}

module.exports = { popular, limpar };
