# Dockerfile

FROM python:3.13-alpine

WORKDIR /app

# Installation des dépendances
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# On ne copie pas le code src/ ici, 
# car on veut l'avoir via le bind mount pour le hot-reload.
# CMD ["/bin/bash"] serait possible, 
# mais on laisse docker-compose gérer la commande (runserver).
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
