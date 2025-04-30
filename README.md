Le script pour config la db est dans django avec la fonctionnalite "migration" donc tout config avec models et view dans core

le hoat realoading ce fait grace au bind mount et 'APP_DIRS': True,

SSR mit en place dans template

Endpoint exemple avec hello word qui retourne le template hello word et stock en db dans la table hellotest

localhost:8000/hello dans le browser

adminer : localhost:8080
systeme       PostgreSQL
Serveur       db
Utilisateur   django_user
MDP           django_pass
BDD           'leave blank'

go to django_db -> core_hellotest -> afficher les donnees

volume pour la db pour pas perdre les donnees entre les redemarrages


TODO :

MOteur SPA
comprendre modele de base du user pour le override / lettendre
JWT

DJango est config au minimum pour garantir endpoint et db communication et migration
ainsi que un .env (mettre les clef prive de django settings.py et le mettre en env), aucun secret doit etre visible dans le code
le .env doit etre gitignore