DC := docker compose

up:
	$(DC) up -d --build

down:
	$(DC) down

update:
	(cd backend && npm install --package-lock-only && npm update --package-lock-only)
	(cd frontend && npm install --package-lock-only && npm update --package-lock-only)

local:
	(cd backend && rm -rf node_modules && npm ci)
	(cd frontend && rm -rf node_modules && npm ci)

.PHONY: up down update local
