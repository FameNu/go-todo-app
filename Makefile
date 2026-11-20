.PHONY: db-up db-down run build test-api

API_DIR := ./api
BASE_URL ?= http://localhost:8080

db-up:
	docker compose up -d db

db-down:
	docker compose down

run:
	cd $(API_DIR) && go run ./cmd/server

build:
	cd $(API_DIR) && go build -o ../bin/server ./cmd/server

test-api:
	curl --fail --show-error $(BASE_URL)/health
	@echo '\nCreate a category:'
	curl --fail --show-error -X POST $(BASE_URL)/api/v1/categories -H 'Content-Type: application/json' -d '{"name":"Patient Follow-up","color":"#3B82F6"}'
	@echo '\nList categories:'
	curl --fail --show-error $(BASE_URL)/api/v1/categories
	@echo '\nCreate a todo (replace category_id with an existing category ID):'
	curl --fail --show-error -X POST $(BASE_URL)/api/v1/todos -H 'Content-Type: application/json' -d '{"title":"Review appointment notes","category_id":1,"priority":"high"}'
	@echo '\nList todos:'
	curl --fail --show-error '$(BASE_URL)/api/v1/todos?status=pending&category_id=1'
