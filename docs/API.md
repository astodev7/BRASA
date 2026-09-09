# BRASA — Documentação da API

Base URL (desenvolvimento): `http://localhost:4000/api`

Todas as respostas seguem o formato:

```json
{ "success": true, "data": { } }
```

Erros:

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "Dados inválidos." } }
```

Autenticação administrativa é feita via cookie `httpOnly` (`brasa_token`), definido no login. Também é aceito um header `Authorization: Bearer <token>` para integrações externas.

---

## Saúde

### `GET /health`
Verifica se a API e o banco de dados estão disponíveis.

```json
{ "status": "ok", "database": "connected", "timestamp": "2026-09-07T12:00:00.000Z" }
```

---

## Cardápio (público)

### `GET /menu`
Lista os pratos disponíveis. Parâmetro opcional: `?category=<slug>`.

### `GET /menu/categories`
Lista as categorias ativas, ordenadas por `display_order`.

### `GET /menu/:slug`
Detalhe de um prato pelo slug. Retorna `404` se não existir.

---

## Reservas (público)

### `POST /reservations`
Cria uma solicitação de reserva com status inicial `pending`.

Corpo:

```json
{
  "customer_name": "Maria Silva",
  "email": "maria@example.com",
  "phone": "(81) 99999-0000",
  "reservation_date": "2026-09-20",
  "reservation_time": "20:00",
  "guests": 4,
  "notes": "Mesa perto da janela, se possível."
}
```

Regras: data não pode estar no passado, horário entre 18h e 23h, entre 1 e 20 pessoas. Rota protegida por rate limiting.

---

## Contato (público)

### `POST /contact`
Envia uma mensagem de contato. Corpo: `name`, `email`, `phone` (opcional), `subject`, `message`.

---

## Autenticação

### `POST /auth/login`
Corpo: `{ "email": "...", "password": "..." }`. Define o cookie de sessão. Protegido por rate limiting reforçado contra força bruta.

### `POST /auth/logout`
Limpa o cookie de sessão.

### `GET /auth/me`
Retorna o usuário autenticado (requer sessão válida).

---

## Administração (requer autenticação + papel `admin` ou `manager`)

### Dashboard
- `GET /admin/dashboard` — contadores de reservas, mensagens novas e pratos.

### Cardápio
- `GET /admin/menu` — lista completa (inclusive indisponíveis)
- `POST /admin/menu` — cria um prato
- `PUT /admin/menu/:id` — atualiza um prato (parcial)
- `DELETE /admin/menu/:id` — remove um prato

### Categorias
- `GET /admin/categories`
- `POST /admin/categories`
- `PUT /admin/categories/:id`
- `DELETE /admin/categories/:id`

### Reservas
- `GET /admin/reservations` — parâmetro opcional `?status=pending|confirmed|cancelled|completed`
- `PATCH /admin/reservations/:id/status` — corpo `{ "status": "confirmed" }`

### Mensagens
- `GET /admin/messages` — parâmetro opcional `?status=new|read|replied|archived`
- `PATCH /admin/messages/:id/status` — corpo `{ "status": "read" }`

---

## Códigos de erro comuns

| Código             | HTTP | Situação                                   |
|--------------------|------|---------------------------------------------|
| VALIDATION_ERROR   | 400  | Dados de entrada inválidos                  |
| UNAUTHORIZED       | 401  | Sessão ausente, inválida ou expirada        |
| FORBIDDEN          | 403  | Usuário autenticado sem permissão suficiente|
| NOT_FOUND          | 404  | Recurso ou rota inexistente                 |
| CONFLICT           | 409  | Conflito de dados (ex: nome duplicado)      |
| RATE_LIMITED       | 429  | Excesso de requisições                      |
| INTERNAL_ERROR     | 500  | Erro interno não esperado                   |
