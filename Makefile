DC := docker compose

up: build
	$(DC) up -d

build:
	$(DC) build

down:
	$(DC) down

down-v:
	$(DC) down -v

.PHONY: up build down down-v
