# Makefile

# Pour lancer docker-compose, vous pouvez utiliser les variables si besoin
DC := docker compose
COMPOSE_FILE := docker-compose.yml

.PHONY: up
up:
	$(DC) -f $(COMPOSE_FILE) up -d

.PHONY: up-build
up-build:
	$(DC) -f $(COMPOSE_FILE) up --build -d

.PHONY: up-cmd
up-d:
	$(DC) -f $(COMPOSE_FILE) up

.PHONY: down
down:
	$(DC) -f $(COMPOSE_FILE) down

.PHONY: down-v
down-v:
	$(DC) -f $(COMPOSE_FILE) down -v
