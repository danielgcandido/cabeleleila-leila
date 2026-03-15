# Cabeleleila Leila — Sistema de Agendamento

Sistema de agendamento para salão de beleza, desenvolvido como avaliação técnica DSIN.

## Demo

[![Assistir vídeo demo](https://drive.google.com/thumbnail?id=1wiozVblbp0B6z6zJDcVvLQAiz1rMbuSc&sz=w1280)](https://drive.google.com/file/d/1wiozVblbp0B6z6zJDcVvLQAiz1rMbuSc/view?usp=drive_link)

> Clique na imagem acima para assistir ao vídeo demo completo no Google Drive.

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express.js |
| Frontend | React 18 + Vite |
| UI | Tailwind CSS + componentes customizados |
| Formulários | React Hook Form + Zod |
| Data Fetching | TanStack Query (React Query) |
| Banco de Dados | MySQL 8.0 |
| ORM | Sequelize v6 |
| Autenticação | JWT (jsonwebtoken + bcryptjs) |
| Documentação API | Swagger (swagger-jsdoc + swagger-ui-express) |
| Testes Backend | Jest + Supertest |
| Testes Frontend | Vitest + Testing Library |

## Funcionalidades

### Cliente
- Cadastro e login com JWT
- Criar agendamentos com múltiplos serviços
- Regra dos 2 dias: alteração/cancelamento online disponível apenas com 2+ dias de antecedência
- Sugestão inteligente: se já tiver agendamento na semana, sugere a mesma data
- Histórico de agendamentos com filtro por período e status
- Detalhes completos do agendamento

### Admin
- Painel de gerenciamento de todos os agendamentos
- Confirmação de agendamentos
- Atualização do status individual de cada serviço (pending → in_progress → completed)
- Dashboard semanal com gráficos (Recharts) e métricas de receita
- Sem restrição dos 2 dias (admin pode alterar qualquer agendamento)

## Screenshots

<details>
<summary>Fluxo do Cliente</summary>

#### Cadastro
![Formulário de cadastro](screenshots/01-cadastro-form.png)
![Cadastro preenchido](screenshots/02-cadastro-preenchido.png)
![Cadastro com sucesso](screenshots/03-cadastro-sucesso.png)

#### Login
![Tela de login](screenshots/04-login.png)

#### Agendamentos
![Home do cliente](screenshots/05-cliente-home.png)
![Formulário de agendamento](screenshots/06-agendamento-form.png)
![Agendamento preenchido](screenshots/07-agendamento-preenchido.png)
![Agendamento criado](screenshots/08-agendamento-criado.png)

#### Sugestão Inteligente
![Banner de sugestão](screenshots/09-sugestao-banner.png)
![Sugestão aceita](screenshots/10-sugestao-aceita.png)

#### Histórico e Detalhes
![Lista de histórico](screenshots/11-historico-lista.png)
![Histórico filtrado](screenshots/12-historico-filtrado.png)
![Detalhes do agendamento](screenshots/13-agendamento-detalhes.png)

#### Regra dos 2 Dias
![Bloqueio pela regra dos 2 dias](screenshots/14-regra-2dias-bloqueio.png)
![Edição permitida](screenshots/15-edicao-permitida.png)

</details>

<details>
<summary>Fluxo Admin</summary>

#### Login e Painel
![Login admin](screenshots/16-admin-login.png)
![Painel de agendamentos](screenshots/17-admin-agendamentos.png)

#### Gerenciamento
![Confirmação de agendamento](screenshots/18-admin-confirmar.png)
![Status do serviço](screenshots/19-admin-status-servico.png)
![Serviço concluído](screenshots/20-admin-servico-concluido.png)
![Edição admin](screenshots/21-admin-edicao.png)

#### Dashboard
![Métricas do dashboard](screenshots/22-dashboard-metricas.png)
![Dashboard semanal](screenshots/23-dashboard-semana.png)
![Gráfico](screenshots/24-dashboard-grafico.png)

</details>

<details>
<summary>Documentação da API (Swagger)</summary>

![Swagger visão geral](screenshots/25-swagger-overview.png)
![Swagger endpoint](screenshots/26-swagger-endpoint.png)

</details>

## Pré-requisitos

- Node.js 18+
- MySQL 8.0 (local ou Docker)
- npm

## Setup Local

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd cabeleleila-leila
```

### 2. Configurar o Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env com suas credenciais do MySQL
```

Criar e popular o banco:
```bash
npm run db:create
npm run db:migrate
npm run db:seed
npm run dev
# Backend rodando em http://localhost:3001
```

### 3. Configurar o Frontend

```bash
cd frontend
npm install
npm run dev
# Frontend rodando em http://localhost:5173
```

## Setup com Docker

```bash
docker-compose up -d
```

| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| Swagger | http://localhost:3001/api-docs |

## Credenciais de Teste

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | admin@cabeleleila.com | admin123 |
| Cliente | Criar via /cadastro | — |

## Variáveis de Ambiente

### Backend

```env
PORT=3001
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=cabeleleila_db

JWT_SECRET=seu-segredo-aqui
JWT_EXPIRES_IN=7d
```

### Frontend

O frontend usa variáveis prefixadas com `VITE_`:

| Variável | Default | Descrição |
|----------|---------|-----------|
| VITE_API_URL | /api | URL base da API (ex: `http://localhost:3001/api`) |

## Scripts

### Backend
```bash
npm run dev          # Servidor com hot reload (nodemon)
npm start            # Produção
npm test             # Todos os testes
npm run test:unit    # Apenas testes unitários
npm run test:integration  # Apenas integração
npm run db:migrate   # Executar migrations
npm run db:seed      # Popular banco com dados iniciais
npm run db:reset     # Resetar banco (drop + migrate + seed)
```

### Frontend
```bash
npm run dev    # Vite dev server
npm run build  # Build de produção
npm test       # Vitest
```

## Testes

### Backend (Jest + Supertest)

```bash
cd backend
npm test                   # Todos os testes
npm run test:unit          # Apenas unitários
npm run test:integration   # Apenas integração
```

**Unitários:**
- Regra dos 2 dias (`canModifyOnline`) — valida se o cliente pode alterar/cancelar online
- Detecção de conflito de horário — verifica sobreposição de agendamentos

**Integração:**
- Fluxo de autenticação — registro, login e validação de token
- CRUD de agendamentos — criação, listagem, edição e cancelamento

### Frontend (Vitest + Testing Library)

```bash
cd frontend
npm test
```

- **SuggestionBanner** — renderização e comportamento do banner de sugestão de mesma semana
- **AppointmentForm** — validação de campos e submissão do formulário de agendamento

## API Endpoints

Documentação completa em `/api-docs` (Swagger).

### Autenticação
| Método | Rota | Acesso |
|--------|------|--------|
| POST | /api/auth/register | Público |
| POST | /api/auth/login | Público |
| GET | /api/auth/profile | Auth |

### Serviços
| Método | Rota | Acesso |
|--------|------|--------|
| GET | /api/services | Público |

### Agendamentos (Cliente)
| Método | Rota | Acesso |
|--------|------|--------|
| POST | /api/appointments | Auth |
| GET | /api/appointments | Auth |
| GET | /api/appointments/suggestion | Auth |
| GET | /api/appointments/:id | Auth |
| PUT | /api/appointments/:id | Auth |
| DELETE | /api/appointments/:id | Auth |

### Admin
| Método | Rota | Acesso |
|--------|------|--------|
| GET | /api/admin/appointments | Admin |
| GET | /api/admin/appointments/:id | Admin |
| PUT | /api/admin/appointments/:id | Admin |
| PATCH | /api/admin/appointments/:id/confirm | Admin |
| PATCH | /api/admin/appointments/:id/services/:sid/status | Admin |
| GET | /api/admin/dashboard/weekly | Admin |

### Health Check
| Método | Rota | Acesso |
|--------|------|--------|
| GET | /api/health | Público |

## Arquitetura

```
cabeleleila-leila/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuração Sequelize
│   │   ├── controllers/    # Handlers HTTP
│   │   ├── middlewares/    # Auth, roleGuard, validators, errorHandler
│   │   ├── models/         # Sequelize models + associations
│   │   ├── routes/         # Express Router com Swagger JSDoc
│   │   ├── services/       # Lógica de negócio (appointmentService, suggestionService, dashboardService)
│   │   └── utils/          # dateUtils, apiResponse
│   ├── migrations/         # Migrations Sequelize
│   ├── seeders/            # Serviços iniciais + admin
│   └── tests/              # Jest (unit + integration)
└── frontend/
    ├── src/
    │   ├── api/            # Axios + funções de chamada
    │   ├── components/     # UI reutilizável (shadcn-inspired)
    │   ├── contexts/       # AuthContext
    │   ├── hooks/          # TanStack Query hooks
    │   ├── pages/          # Páginas (client + admin)
    │   ├── routes/         # AppRoutes, PrivateRoute, AdminRoute
    │   └── schemas/        # Zod schemas
    └── __tests__/          # Vitest
```

## Modelo de Dados

```
Client (1:N) ──→ Appointment (N:M) ──→ Service
                       │
                       └── via AppointmentService
                           (com service_status individual)
```

| Entidade | Campos principais |
|----------|-------------------|
| **Client** | name, email, phone, password, role (client/admin) |
| **Service** | name, description, duration_minutes, price, active |
| **Appointment** | client_id, appointment_date, appointment_time, total_duration_minutes, status (pending/confirmed/completed/cancelled) |
| **AppointmentService** | appointment_id, service_id, service_status (pending/in_progress/completed) |

## Regras de Negócio

### Regra dos 2 dias
Clientes só podem alterar ou cancelar agendamentos com pelo menos 2 dias de antecedência. Caso contrário, um alerta é exibido com o número de telefone para contato.

### Sugestão de mesma semana
Ao criar um novo agendamento, o sistema verifica se o cliente já tem agendamentos na semana da data selecionada e sugere agendar na mesma data para facilitar a organização.

### Verificação de conflito de horário
O sistema verifica se o horário selecionado (considerando a duração total dos serviços) conflita com outros agendamentos existentes na mesma data.

### Roles
- `client`: acesso ao fluxo de agendamento
- `admin`: acesso ao painel administrativo + bypass da regra dos 2 dias
