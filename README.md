# Backend - API de Gerenciamento de Leads

API RESTful construída com Node.js, Express e TypeScript seguindo princípios SOLID e Clean Code.

## 🏗️ Arquitetura Detalhada

O projeto segue uma arquitetura em camadas com princípios SOLID:

```
src/
├── config/              # Configurações do sistema
│   ├── database.ts      # Conexão MongoDB
│   ├── env.ts          # Validação de variáveis de ambiente
│   └── swagger.ts      # Documentação da API
├── models/             # Modelos Mongoose
│   ├── Lead.ts         # Modelo de Lead
│   └── User.ts         # Modelo de Usuário
├── types/              # Tipos e interfaces TypeScript
│   └── index.ts        # Definições de tipos globais
├── validators/         # Validações com Joi
│   ├── authValidator.ts    # Validações de autenticação
│   └── leadValidator.ts    # Validações de leads
├── middleware/         # Middlewares personalizados
│   ├── authMiddleware.ts    # Autenticação JWT
│   ├── errorMiddleware.ts   # Tratamento de erros
│   ├── securityMiddleware.ts # Rate limiting e segurança
│   └── validateMiddleware.ts # Validação de dados
├── repositories/       # Camada de acesso aos dados
│   ├── leadRepository.ts    # Operações de Lead no banco
│   └── userRepository.ts    # Operações de Usuário no banco
├── services/           # Lógica de negócio
│   ├── authService.ts      # Serviços de autenticação
│   └── leadService.ts      # Serviços de leads
├── controllers/        # Controladores HTTP
│   ├── authController.ts   # Controle de autenticação
│   └── leadController.ts   # Controle de leads
├── routes/             # Definição de rotas
│   ├── index.ts           # Rotas principais
│   ├── authRoutes.ts      # Rotas de autenticação
│   └── leadRoutes.ts      # Rotas de leads
├── app.ts              # Configuração do Express
└── server.ts           # Inicialização do servidor
```

### 🔄 Fluxo de Dados
1. **Request** → Middleware (auth, validation, security)
2. **Controller** → Service (lógica de negócio)
3. **Service** → Repository (acesso aos dados)
4. **Repository** → Database (MongoDB)
5. **Response** ← Controller ← Service ← Repository

### Princípios SOLID Aplicados

- **SRP (Single Responsibility Principle)**: Cada camada tem uma responsabilidade única
- **DIP (Dependency Inversion Principle)**: Services dependem de abstrações (Repositories)
- **OCP (Open/Closed Principle)**: Extensível através de middlewares e validators

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=JWT
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Executando

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

## 📡 API Endpoints

### 🔓 Rotas Públicas
- `GET /api/v1/health` - Health check da API
- `POST /api/v1/leads` - Criar lead (formulário público)
- `POST /api/v1/auth/login` - Login de usuário

### Rotas Protegidas (Requerem Autenticação)

#### 📊 Leads
- `GET /api/v1/leads/admin` - Listar leads com paginação e busca
- `POST /api/v1/leads/admin` - Criar lead (painel admin)
- `GET /api/v1/leads/admin/stats` - Estatísticas de leads
- `GET /api/v1/leads/admin/:id` - Buscar lead por ID
- `PUT /api/v1/leads/admin/:id` - Atualizar lead
- `DELETE /api/v1/leads/admin/:id` - Desativar lead (soft delete)
- `DELETE /api/v1/leads/admin/:id/permanent` - Deletar permanentemente (apenas admin)

#### 👤 Autenticação
- `GET /api/v1/auth/me` - Dados do usuário autenticado
- `POST /api/v1/auth/register` - Criar usuário (apenas admin) - Não coloquei no front
- `GET /api/v1/auth/users` - Listar usuários (apenas admin) - Não coloquei no front

### 📋 Parâmetros de Query (Leads)
- `page` - Número da página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máximo: 100)
- `search` - Termo de busca (nome ou email)

### Autenticação
Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <jwt_token>
```

## 📚 Documentação da API - Swagger

A API possui documentação completa através do Swagger/OpenAPI 3.0!

### 🌐 Acesso à Documentação
- **Desenvolvimento Local**: `http://localhost:5000/docs`
- **Produção**: `Adicionarei após o deploy`

### ✨ Recursos da Documentação
- **Todos os endpoints** documentados com exemplos
- **Schemas detalhados** para request/response
- **Códigos de erro** e suas descrições
- **Teste interativo** dos endpoints
- **Categorização** por funcionalidade

### Como Usar a Autenticação no Swagger
1. **Faça login** usando o endpoint `/auth/login`
2. **Copie o token** retornado na resposta
3. **Clique em "Authorize"** no topo da página
4. **Cole o token** no formato: `Bearer SEU_TOKEN_AQUI`
5. **Teste os endpoints protegidos**!

### 🔑 Credenciais Padrão
Para testar a API, você pode usar as seguintes credenciais:
- **Email**: `leads@leads.com.br`
- **Senha**: `leads123`
- Ou criar um usuário através do swagger

### 📡 Endpoints Documentados

#### Autenticação
- `POST /auth/login` - Login (público)
- `POST /auth/register` - Criar usuário (admin)
- `GET /auth/me` - Dados do usuário (protegido)
- `GET /auth/users` - Listar usuários (admin)

#### Leads
- `POST /leads` - Criar lead (público)
- `POST /leads/admin` - Criar lead (admin)
- `GET /leads/admin` - Listar leads (protegido)
- `GET /leads/admin/stats` - Estatísticas (protegido)
- `GET /leads/admin/{id}` - Obter lead (protegido)
- `PUT /leads/admin/{id}` - Atualizar lead (protegido)
- `DELETE /leads/admin/{id}` - Desativar lead (protegido)
- `DELETE /leads/admin/{id}/permanent` - Excluir permanentemente (admin)

#### Sistema
- `GET /health` - Health check (público)

### Exemplos de Uso

#### 1. Criar Lead (Público)
```json
POST /leads
{
  "name": "João Silva",
  "email": "joao@example.com",
  "phone": "(11) 99999-9999",
  "position": "Desenvolvedor",
  "birthDate": "1990-01-01",
  "message": "Interessado no produto"
}
```

#### 2. Login
```json
POST /auth/login
{
  "email": "leads@leads.com.br",
  "password": "leads123"
}
```

#### 3. Listar Leads (Protegido)
```
GET /leads/admin?page=1&limit=10&search=joão
Authorization: Bearer SEU_TOKEN_AQUI
```

### 🔧 Configuração Técnica do Swagger

#### Dependências Instaladas
```json
{
  "swagger-jsdoc": "^6.2.8",
  "swagger-ui-express": "^5.0.0",
  "@types/swagger-jsdoc": "^6.0.4",
  "@types/swagger-ui-express": "^4.1.6"
}
```

## Segurança

- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: Proteção contra força bruta e DoS
- **JWT**: Autenticação stateless
- **Bcrypt**: Hash de senhas
- **Joi**: Validação de dados de entrada
- **CORS**: Configurado para aceitar apenas o frontend


## Tecnologias

- Node.js
- Express
- TypeScript
- MongoDB/Mongoose
- JWT
- Joi
- Bcrypt
- Helmet
- Express Rate Limit






