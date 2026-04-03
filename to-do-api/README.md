# to-do-api

REST API for **to-do-web**, built with [Bun](https://bun.sh), [Elysia](https://elysiajs.com), [Prisma](https://prisma.io), and [Supabase](https://supabase.com) (PostgreSQL).

---

## Stack

| Layer      | Technology            |
|------------|-----------------------|
| Runtime    | Bun                   |
| Framework  | Elysia v1             |
| ORM        | Prisma v6             |
| Database   | Supabase (PostgreSQL) |

---

## Getting started

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```bash
cp .env.example .env
```

Find the connection strings in your Supabase dashboard under  
**Project Settings → Database → Connection string** (use the *URI* tab).

| Variable       | Where to find it                                   |
|----------------|----------------------------------------------------|
| `DATABASE_URL` | Pooler URL — port **6543** (Transaction mode)      |
| `DIRECT_URL`   | Direct URL — port **5432**                         |

### 3. Push schema to Supabase

```bash
bun run db:push        # quick apply without migration history
# or
bun run db:migrate     # create a named migration
```

### 4. Start the dev server

```bash
bun run dev
```

The API listens on <http://localhost:3000> by default.

---

## Endpoints

| Method   | Path          | Description            |
|----------|---------------|------------------------|
| `GET`    | `/health`     | Health check           |
| `GET`    | `/openapi`    | OpenAPI docs UI        |
| `GET`    | `/openapi/json` | OpenAPI JSON spec    |
| `GET`    | `/todos`      | List all todos         |
| `GET`    | `/todos/:id`  | Get a single todo      |
| `POST`   | `/todos`      | Create a todo          |
| `PATCH`  | `/todos/:id`  | Update title/completed |
| `DELETE` | `/todos/:id`  | Delete a todo          |

### Request / Response examples

**POST `/todos`**
```json
// body
{ "title": "Buy groceries" }

// response 200
{ "id": 1, "title": "Buy groceries", "completed": false, "createdAt": "...", "updatedAt": "..." }
```

**PATCH `/todos/1`**
```json
// body (all fields optional)
{ "completed": true }
```

---

## Environment variables

| Variable      | Required | Default                  | Description                       |
|---------------|----------|--------------------------|-----------------------------------|
| `DATABASE_URL`| ✅        | —                        | Prisma pooled connection string   |
| `DIRECT_URL`  | ✅        | —                        | Prisma direct connection string   |
| `PORT`        | ❌        | `3000`                   | Port the server listens on        |
| `CORS_ORIGIN` | ❌        | localhost + Codespaces   | Allowed CORS origin(s), `*`, or comma-separated list |
