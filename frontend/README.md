# BRASA — Frontend

Aplicação React (Vite) que consome a API do backend BRASA. Não contém regras de negócio sensíveis nem credenciais — tudo isso vive no backend.

## Stack

- React 18 + React Router
- Vite
- CSS puro com tokens de design (sem framework de UI)

## Instalação

```bash
cd frontend
npm install
cp .env.example .env
```

## Variáveis de ambiente

| Variável       | Descrição                          |
|----------------|--------------------------------------|
| VITE_API_URL   | URL base da API (ex: `http://localhost:4000/api`) |

## Executando localmente

```bash
npm run dev
```

Abre em `http://localhost:5173`. Em desenvolvimento, o Vite já faz proxy de `/api` para `http://localhost:4000` (ver `vite.config.js`) — ajuste conforme sua necessidade.

## Build de produção

```bash
npm run build
npm run preview   # para testar o build localmente
```

Os arquivos finais ficam em `dist/`, prontos para qualquer hospedagem estática (Netlify, Vercel, S3+CloudFront, Nginx etc.), desde que a API esteja acessível a partir da origem configurada em `VITE_API_URL`.

## Estrutura

```text
src/
├── components/   # componentes reutilizáveis (Navbar, cards, estados, etc.)
├── pages/        # páginas públicas e páginas /admin
├── layouts/       # layout público e layout do painel administrativo
├── hooks/        # useFetch, useAsyncAction
├── services/     # cliente de API
├── context/      # autenticação
└── styles/       # tokens de design + CSS global/admin
```

## Rotas

```text
/                 Home
/cardapio         Cardápio (com filtro por categoria e busca)
/cardapio/:slug   Detalhe do prato
/reservas         Formulário de reserva
/contato          Formulário de contato
/sobre            Sobre o restaurante
/admin/login      Login administrativo
/admin/*          Painel administrativo (protegido)
```

## Notas de design

A identidade visual segue uma linha editorial (tipografia como elemento central, composição assimétrica, paleta carvão/creme/terracota), evitando os clichês visuais de interfaces geradas por IA (gradientes roxos, glassmorphism, cards genéricos). O painel `/admin` tem uma linguagem visual própria, mais funcional, priorizando tabelas e produtividade.
