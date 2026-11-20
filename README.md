# Clinic Todo API

A small Go REST API for managing clinic workflow tasks and their categories. The code is split into HTTP handlers, business services, persistence repositories, GORM models, and configuration so each layer has a focused responsibility.

## Requirements

- Go 1.27.4+
- Docker with Compose (for local PostgreSQL)

## Run locally

```sh
cp .env.example .env
make db-up
make run
```

The API listens on `http://localhost:8080`. On startup it connects to PostgreSQL and runs GORM auto-migrations. Set `DATABASE_URL` for a hosted PostgreSQL URL, or configure `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` for local use. `DATABASE_URL` takes precedence. Hosted databases should include their required TLS query options, such as `sslmode=require`.

Stop the local database with `make db-down`; the named volume keeps data between restarts. Run unit tests with `cd api && go test ./...`, build with `make build`, or use `make test-api` against a running server. `BASE_URL` can override the curl target.

## Next.js web app

The responsive clinic dashboard lives in `web/`, uses Tailwind CSS 4 utility classes, and calls the API at `http://localhost:8080` by default. Start the API and PostgreSQL first, then run:

```sh
cp web/.env.example web/.env.local
make web-install
make web-dev
```

Open `http://localhost:3000`. The dashboard supports category creation, task creation and editing, completion, deletion, and filtering. To point it at another API origin, change `NEXT_PUBLIC_API_URL` in `web/.env.local`. The API must allow that web origin through `ALLOWED_ORIGINS`.

Create a production build with `make web-build` and serve it with `cd web && npm run start`.

## API

All resources are under `/api/v1`; `/health` is also exposed at the root for hosting platform health checks. JSON errors have an `error` field. Missing resources return 404, invalid inputs return 400, and duplicate category names return 409.

| Method | Path | Description |
| --- | --- | --- |
| GET | `/health` | Database readiness: `{"status":"ok","database":"connected"}` |
| POST | `/api/v1/categories` | Create category: `{"name":"Patient Follow-up","color":"#3B82F6"}` |
| GET | `/api/v1/categories` | List categories |
| POST | `/api/v1/todos` | Create todo; `title` and existing `category_id` required |
| GET | `/api/v1/todos` | List, optionally filter by `status` and `category_id` |
| GET | `/api/v1/todos/:id` | Get one todo with its category |
| PATCH | `/api/v1/todos/:id` | Update any of `title`, `status`, `priority` |
| DELETE | `/api/v1/todos/:id` | Delete todo (204 on success) |

Todo status values are `pending`, `in_progress`, and `completed`. Priority values are `low`, `medium`, and `high`. Defaults are `pending` and `medium`; category color defaults to `#3B82F6`. `due_date`, when supplied, must be an RFC3339 timestamp or `null`.

Example:

```sh
curl -X POST http://localhost:8080/api/v1/categories \
  -H 'Content-Type: application/json' \
  -d '{"name":"Patient Follow-up"}'

curl -X POST http://localhost:8080/api/v1/todos \
  -H 'Content-Type: application/json' \
  -d '{"title":"Review appointment notes","category_id":1,"priority":"high"}'

curl 'http://localhost:8080/api/v1/todos?status=pending&category_id=1'
```

## Deployment

Deploy the `api` directory as the Docker build context. Configure `DATABASE_URL` and `PORT` in the hosting environment; the container listens on `PORT` (default `8080`). `ALLOWED_ORIGINS` accepts the CORS origin setting and defaults to `*`; set an explicit frontend origin for production. The API automatically migrates its two tables at startup.
