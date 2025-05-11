DC := docker compose

up: build
	$(DC) up -d

build:
	$(DC) build

down:
	$(DC) down

down-v:
	$(DC) down -v

update:
	(cd backend && npm install --package-lock-only && npm update --package-lock-only)
	(cd frontend && npm install --package-lock-only && npm update --package-lock-only)

.PHONY: up build down down-v update
