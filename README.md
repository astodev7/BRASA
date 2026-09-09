# BRASA

Projeto full-stack de demonstração: um restaurante contemporâneo especializado em pratos preparados na brasa. Construído como se fosse para um cliente real — com frontend, backend, banco de dados, autenticação administrativa, validação, segurança, SEO, acessibilidade e testes.

> Os dados do restaurante (endereço, telefone, cardápio) são **fictícios**, criados apenas para fins de demonstração/portfólio.

## Visão geral da arquitetura

```text
brasa/
├── frontend/    React + Vite — site público e painel administrativo
├── backend/     Node.js + Express — API REST
├── database/    Migrations SQL e script de seed (PostgreSQL)
└── docs/        Documentação da API
```

O frontend nunca acessa o banco diretamente nem guarda credenciais — tudo passa pela API do backend, que é a única camada com acesso ao PostgreSQL e aos segredos (JWT, SMTP etc.).

## Stack

| Camada     | Tecnologia                                             |
|------------|----------------------------------------------------------|
| Frontend   | React 18, React Router, Vite, CSS puro                   |
| Backend    | Node.js, Express, Zod, JWT, bcrypt, Helmet, express-rate-limit |
| Banco      | PostgreSQL                                                |
| E-mail     | Nodemailer (SMTP configurável)                            |
| Testes     | Jest + Supertest                                          |

## Rodando o projeto localmente

### 1. Banco de dados

Crie o banco (localmente ou em um provedor hospedado como Supabase/RDS) e instale as dependências dos scripts de migration/seed:

```bash
createdb brasa_db          # ou crie pelo painel do seu provedor hospedado
cd database
npm install
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env    # edite DATABASE_URL, JWT_SECRET etc.
npm run migrate          # aplica o schema (usa as dependências instaladas em database/)
npm run seed              # dados fictícios + usuário admin de desenvolvimento
npm run dev                # http://localhost:4000
```

Credenciais de admin criadas pelo seed (**apenas desenvolvimento**):

```
admin@brasa.example / BrasaAdmin#2026
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL apontando para a API
npm run dev               # http://localhost:5173
```

Acesse `http://localhost:5173` para o site público e `http://localhost:5173/admin/login` para o painel administrativo.

## Documentação

- [`docs/API.md`](docs/API.md) — endpoints da API REST
- [`backend/README.md`](backend/README.md) — detalhes do backend, variáveis de ambiente e deploy
- [`frontend/README.md`](frontend/README.md) — detalhes do frontend e build de produção

## Funcionalidades

**Site público**
- Cardápio dinâmico (vindo da API, com filtro por categoria e busca)
- Página de detalhe de cada prato
- Formulário de reservas com validação client-side e server-side, dentro do horário de funcionamento
- Formulário de contato
- SEO técnico: `robots.txt`, `sitemap.xml`, metatags, Open Graph, dados estruturados (Schema.org `Restaurant`)
- Estados de loading, erro, vazio e indisponibilidade em toda a navegação
- Acessibilidade: HTML semântico, navegação por teclado, foco visível, labels associados

**Painel administrativo (`/admin`)**
- Login protegido por JWT em cookie `httpOnly`, com rate limiting contra força bruta
- Dashboard com indicadores (reservas pendentes/confirmadas, mensagens novas, pratos disponíveis/destacados)
- CRUD completo de pratos e categorias
- Gestão de reservas (alteração de status: pendente → confirmada/cancelada/concluída)
- Gestão de mensagens de contato (nova/lida/respondida/arquivada)

**Segurança**
- Senhas com hash bcrypt, nunca em texto puro
- Segredos (`DATABASE_URL`, `JWT_SECRET`, credenciais SMTP) apenas no backend, nunca no frontend
- Helmet, CORS restrito por variável de ambiente, rate limiting em rotas públicas sensíveis
- Validação de entrada em todas as rotas mutáveis (Zod), tanto no frontend quanto no backend
- Honeypot simples contra spam nos formulários públicos
- Erros nunca vazam stack trace ou detalhes internos para o cliente

## Testes

```bash
cd backend
npm test
```

Cobre os fluxos críticos: validação de reservas, validação de login e proteção das rotas administrativas.

## Licença

Projeto de portfólio — sem dados reais de nenhum restaurante existente.
