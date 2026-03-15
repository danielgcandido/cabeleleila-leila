# Cabeleleila Leila — Sistema de Agendamento

Sistema de agendamento para salão de beleza, desenvolvido como avaliação técnica DSIN.

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

## Variáveis de Ambiente (Backend)

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
| PUT | /api/admin/appointments/:id | Admin |
| PATCH | /api/admin/appointments/:id/confirm | Admin |
| PATCH | /api/admin/appointments/:id/services/:sid/status | Admin |
| GET | /api/admin/dashboard/weekly | Admin |

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
