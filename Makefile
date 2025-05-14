DC := docker compose

up:
	$(DC) up -d

down:
	$(DC) down

down-v:
	$(DC) down -v

update:
	(cd backend && npm install --package-lock-only && npm update --package-lock-only)
	(cd frontend && npm install --package-lock-only && npm update --package-lock-only)

.PHONY: up down down-v update
