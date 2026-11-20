# Restomod Core — Sistema de Gestão de Oficina de Restomod

Sistema de gestão para oficinas especializadas em **restomod** (restauração e customização de carros clássicos). Permite cadastrar clientes, veículos, oficinas, mecânicos, peças, fornecedores e acompanhar projetos de restomod do início ao fim: serviços executados, upgrades instalados, histórico e inspeções.

## Funcionalidades principais

- Cadastro e consulta de clientes, veículos, oficinas, mecânicos, peças e fornecedores.
- Gestão completa de **Projetos** de restomod (orçamento, prazo, oficina/cliente/veículo responsáveis).
- Serviços executados por projeto, com mecânicos e peças vinculados.
- Upgrades de restomod (motor, turbo, suspensão etc.) ligados a cada projeto.
- Histórico de andamento do projeto e inspeções de veículos.
- Dashboards agregados (serviços por oficina, horas por mecânico, peças mais usadas).
- Assistente de IA (Gemini, via n8n) com contexto completo do banco.
- Cadastro/login de usuários com autenticação JWT.

## Estrutura do repositório

```
restomod-core/
  backend-node/   # API atual (Node.js + Express + Prisma) — Etapa 1 da avaliação
  backend/        # API original em Go + Gin + GORM (preservada como referência, não usada no docker-compose)
  frontend/       # Next.js (React) — interface web
  n8n/            # Workflow do assistente de IA (Gemini)
  docker-compose.yml
```

> O backend foi reescrito de Go para **Node.js + Express + Prisma** para atender aos requisitos da avaliação de Desenvolvimento de Sistemas Web (Etapa 1 — Back-end). O backend Go original foi mantido no repositório como referência, mas não é mais usado pelo `docker-compose.yml`.

## Tecnologias (backend-node)

- **Node.js + Express** — servidor HTTP e rotas.
- **PostgreSQL + Prisma** — banco de dados e ORM.
- **bcrypt** — hash de senhas.
- **jsonwebtoken (JWT)** — autenticação.
- **zod** — validação de dados de entrada.
- **cors** — configuração de CORS.
- **dotenv** — variáveis de ambiente.

## Instalação

```bash
cd backend-node
npm install
```

## Variáveis de ambiente

Copie `backend-node/.env.example` para `backend-node/.env` e preencha os valores:

```bash
cp backend-node/.env.example backend-node/.env
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta em que a API escuta (padrão `8080`) |
| `DATABASE_URL` | String de conexão do PostgreSQL (`postgresql://usuario:senha@host:porta/banco`) |
| `JWT_SECRET` | Segredo usado para assinar/verificar os tokens JWT |
| `JWT_EXPIRES_IN` | Validade do token (ex.: `1d`, `12h`) |
| `CORS_ORIGIN` | Origem do frontend autorizada pelo CORS |

O `.env` real **nunca** é commitado (já está no `.gitignore`).

## Banco de dados

O projeto usa o mesmo banco PostgreSQL já existente (schema em [`Ddl database.sql`](Ddl%20database.sql)). O Prisma mapeia as tabelas já existentes via `@@map`/`@map`, sem precisar recriar nada — só adiciona a nova tabela `usuario` (cadastro/login).

Suba um Postgres (local ou via `docker-compose up db`) e, dentro de `backend-node/`, rode:

```bash
npx prisma generate     # gera o client do Prisma
npx prisma migrate deploy   # cria a tabela "usuario" (e as demais, se o banco for novo)
```

## Execução

```bash
cd backend-node
npm run dev    # desenvolvimento, com reload automático (nodemon)
# ou
npm start      # produção
```

A API sobe em `http://localhost:8080`.

### Com Docker Compose (stack completa: banco + backend + frontend + n8n)

```bash
docker compose up --build
```

## Endpoints disponíveis

Todas as rotas abaixo têm prefixo `/api`. "Autenticação" marca quais exigem `Authorization: Bearer <token>`.

| Método | Endpoint | Autenticação | Descrição |
|---|---|---|---|
| POST | `/api/auth/registrar` | Não | Cadastra um novo usuário (bcrypt hash da senha) |
| POST | `/api/auth/login` | Não | Autentica e retorna um token JWT |
| GET | `/api/clientes` | Não | Lista clientes |
| GET | `/api/clientes/:id` | Não | Busca cliente por ID |
| POST | `/api/clientes` | **Sim** | Cria cliente |
| PUT | `/api/clientes/:id` | **Sim** | Atualiza cliente |
| DELETE | `/api/clientes/:id` | **Sim** | Remove cliente |
| GET | `/api/oficinas` | Não | Lista oficinas |
| GET | `/api/oficinas/:id` | Não | Busca oficina por ID |
| POST | `/api/oficinas` | **Sim** | Cria oficina |
| PUT | `/api/oficinas/:id` | **Sim** | Atualiza oficina |
| DELETE | `/api/oficinas/:id` | **Sim** | Remove oficina |
| GET | `/api/veiculos` | Não | Lista veículos (com cliente) |
| GET | `/api/veiculos/:id` | Não | Busca veículo por ID |
| POST | `/api/veiculos` | **Sim** | Cria veículo |
| PUT | `/api/veiculos/:id` | **Sim** | Atualiza veículo |
| DELETE | `/api/veiculos/:id` | **Sim** | Remove veículo |
| GET | `/api/projetos` | Não | Lista projetos (**entidade principal**, com cliente/oficina/veículo) |
| GET | `/api/projetos/:id` | Não | Busca projeto por ID |
| POST | `/api/projetos` | **Sim** | Cria projeto |
| PUT | `/api/projetos/:id` | **Sim** | Atualiza projeto |
| DELETE | `/api/projetos/:id` | **Sim** | Remove projeto |
| GET | `/api/mecanicos` | Não | Lista mecânicos (com oficina) |
| GET | `/api/mecanicos/:id` | Não | Busca mecânico por ID |
| POST | `/api/mecanicos` | **Sim** | Cria mecânico |
| PUT | `/api/mecanicos/:id` | **Sim** | Atualiza mecânico |
| DELETE | `/api/mecanicos/:id` | **Sim** | Remove mecânico |
| GET | `/api/pecas` | Não | Lista peças (com fornecedores) |
| GET | `/api/pecas/:id` | Não | Busca peça por ID |
| POST | `/api/pecas` | **Sim** | Cria peça |
| PUT | `/api/pecas/:id` | **Sim** | Atualiza peça |
| DELETE | `/api/pecas/:id` | **Sim** | Remove peça |
| GET | `/api/fornecedor` | Não | Lista fornecedores |
| GET | `/api/fornecedor/:id` | Não | Busca fornecedor por ID |
| POST | `/api/fornecedor` | **Sim** | Cria fornecedor |
| PUT | `/api/fornecedor/:id` | **Sim** | Atualiza fornecedor |
| DELETE | `/api/fornecedor/:id` | **Sim** | Remove fornecedor |
| GET | `/api/servicos` | Não | Lista serviços (com projeto, mecânicos, upgrade) |
| GET | `/api/servicos/:id` | Não | Busca serviço por ID |
| POST | `/api/servicos` | **Sim** | Cria serviço |
| PUT | `/api/servicos/:id` | **Sim** | Atualiza serviço |
| DELETE | `/api/servicos/:id` | **Sim** | Remove serviço |
| GET | `/api/usopeca` | Não | Lista usos de peça (com peça e serviço) |
| GET | `/api/usopeca/:id` | Não | Busca uso de peça por ID |
| POST | `/api/usopeca` | **Sim** | Cria uso de peça |
| PUT | `/api/usopeca/:id` | **Sim** | Atualiza uso de peça |
| DELETE | `/api/usopeca/:id` | **Sim** | Remove uso de peça |
| GET | `/api/historicoprojeto` | Não | Lista histórico de projetos |
| GET | `/api/historicoprojeto/:id` | Não | Busca histórico por ID |
| POST | `/api/historicoprojeto` | **Sim** | Cria registro de histórico |
| PUT | `/api/historicoprojeto/:id` | **Sim** | Atualiza registro de histórico |
| DELETE | `/api/historicoprojeto/:id` | **Sim** | Remove registro de histórico |
| GET | `/api/inspecao` | Não | Lista inspeções (com veículo e mecânico) |
| GET | `/api/inspecao/:id` | Não | Busca inspeção por ID |
| POST | `/api/inspecao` | **Sim** | Cria inspeção |
| PUT | `/api/inspecao/:id` | **Sim** | Atualiza inspeção |
| DELETE | `/api/inspecao/:id` | **Sim** | Remove inspeção |
| GET | `/api/upgraderestomod` | Não | Lista upgrades restomod (com projeto) |
| GET | `/api/upgraderestomod/:id` | Não | Busca upgrade por ID |
| POST | `/api/upgraderestomod` | **Sim** | Cria upgrade |
| PUT | `/api/upgraderestomod/:id` | **Sim** | Atualiza upgrade |
| DELETE | `/api/upgraderestomod/:id` | **Sim** | Remove upgrade |
| GET | `/api/mecanicoservico` | Não | Lista vínculos mecânico↔serviço |
| POST | `/api/mecanicoservico` | **Sim** | Cria vínculo mecânico↔serviço |
| DELETE | `/api/mecanicoservico` | **Sim** | Remove vínculo pontual (`?id_servico=&id_mecanico=`) |
| DELETE | `/api/mecanicoservico/limpar` | **Sim** | Remove todos os vínculos de um serviço (`?id_servico=`) |
| GET | `/api/fornecedorpeca` | Não | Lista vínculos peça↔fornecedor |
| POST | `/api/fornecedorpeca` | **Sim** | Cria vínculo peça↔fornecedor |
| DELETE | `/api/fornecedorpeca` | **Sim** | Remove vínculo pontual (`?id_peca=&id_fornecedor=`) |
| DELETE | `/api/fornecedorpeca/limpar` | **Sim** | Remove todos os vínculos de uma peça (`?id_peca=`) |
| GET | `/api/dashboard/servicos-por-oficina` | Não | Valor total de serviços por oficina |
| GET | `/api/dashboard/horas-por-mecanico` | Não | Horas trabalhadas por mecânico |
| GET | `/api/dashboard/pecas-utilizadas` | Não | Peças mais utilizadas |
| GET | `/api/assistente/contexto` | Não | Contexto agregado do banco (usado pelo n8n/Gemini) |
| POST | `/api/seed` | Não | Popula o banco com dados de exemplo |
| DELETE | `/api/drop` | Não | Limpa todas as tabelas de domínio |

## Exemplos de requisição (curl)

```bash
# Cadastro
curl -X POST http://localhost:8080/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{"nome":"Admin","email":"admin@oficina.com","senha":"123456"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@oficina.com","senha":"123456"}'
# -> { "token": "..." }

# Criar projeto (rota protegida)
curl -X POST http://localhost:8080/api/projetos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"titulo":"Opala LS Swap","idCliente":1,"idOficina":1,"idVeiculo":1,"orcamentoTotal":85000}'
```

## Demonstração

A API pode ser testada integralmente via **curl**, usando os exemplos acima como ponto de partida.
