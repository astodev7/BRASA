# BRASA — Backend (API)

API REST em Node.js/Express para o restaurante BRASA, com PostgreSQL, autenticação JWT via cookie, validação com Zod e envio de e-mails transacionais.

## Stack

- Node.js + Express
- PostgreSQL (`pg`)
- Zod (validação)
- JWT + bcrypt (autenticação)
- Helmet, CORS, express-rate-limit (segurança)
- Nodemailer (e-mail transacional)
- Jest + Supertest (testes)

## Estrutura

```text
src/
├── controllers/   # lida com req/res, chama services
├── routes/        # define os endpoints e middlewares aplicados
├── services/      # regras de negócio
├── middlewares/   # auth, erros, rate limiting
├── validators/    # schemas Zod
├── models/        # acesso ao banco (SQL via pg)
├── config/        # env e conexão com o banco
├── utils/         # ApiError, ApiResponse, logger, etc.
└── app.js         # bootstrap da aplicação
```

## Pré-requisitos

- Node.js 18+
- PostgreSQL 14+

## Instalação

```bash
cd backend
npm install
cp .env.example .env
# edite o .env com suas credenciais de banco e segredos
```

## Variáveis de ambiente

Ver `.env.example`. As essenciais:

| Variável        | Descrição                                   |
|-----------------|-----------------------------------------------|
| DATABASE_URL    | String de conexão PostgreSQL                  |
| JWT_SECRET      | Segredo para assinar tokens JWT (obrigatório em produção) |
| CORS_ORIGIN     | Origem do frontend autorizada                 |
| SMTP_*          | Configuração de e-mail transacional (opcional em dev) |

## Banco de dados

Os scripts de migration/seed vivem em `../database/` e têm seu próprio `package.json` (são independentes do backend). Instale as dependências deles uma vez:

```bash
cd ../database
npm install
cd ../backend
```

Criar o banco (localmente ou em um provedor hospedado, ex: Supabase) e aplicar a migration:

```bash
createdb brasa_db     # ou crie pelo painel do seu provedor
npm run migrate
```

Popular com dados de demonstração:

```bash
npm run seed
```

Isso cria categorias, pratos, uma reserva de exemplo e um usuário administrativo de **desenvolvimento**:

```
E-mail: admin@brasa.example
Senha:  BrasaAdmin#2026
```

> Nunca utilize essa credencial em produção. Gere uma nova via hash bcrypt e insira diretamente no banco, ou crie um script de provisionamento próprio para produção.

## Executando localmente

```bash
npm run dev     # com nodemon
# ou
npm start
```

A API sobe por padrão em `http://localhost:4000`.

## Testes

```bash
npm test
```

## Build/produção

Não há etapa de build (Node puro). Para produção:

1. Definir `NODE_ENV=production`.
2. Definir `DATABASE_URL`, `JWT_SECRET` e `COOKIE_SECRET` fortes (a aplicação recusa subir em produção sem eles).
3. Rodar migrations no banco de produção (`npm run migrate`).
4. Iniciar com um process manager (pm2, systemd, ou o orquestrador da sua escolha): `npm start`.
5. Colocar atrás de um proxy reverso com TLS (Nginx, Caddy, ou o load balancer do provedor).

## Endpoints principais

Ver [`../docs/API.md`](../docs/API.md) para a documentação completa.

## Autenticação

- Login gera um JWT armazenado em cookie `httpOnly` (`brasa_token`), com `secure` ativado em produção.
- Rotas `/api/admin/*` exigem sessão válida e papel `admin` ou `manager`.
- Rate limiting mais restrito em `/api/auth/login` para mitigar força bruta.
