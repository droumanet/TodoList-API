# Projet d'étude de différents concepts
Ce projet contient différentes étapes pour tester et mettre en oeuvre des concepts de programmation.
Il s'agit d'un projet Todolist sous forme d'une API

## Version 1.0 : initiale
Dans la version initiale, on utilise une liste en mémoire, basée sur une classe Todo. Les fonctions sont intégrées dans les routes, il n'y a pas de contrôleur.

## Version 1.1 : propre
Dans cette version, on utilise un contrôleur. Les routes sont condensées et plus lisibles

## Version 1.2 : tests
On ajoute des tests unitaires pour valider le fonctionnement de la classe et du contrôleur

## Version 2.0 : database
La version permet désormais l'usage de la persistance avec une base de données sous MariaDB (mySQL)

## Version 2.1 : ORM
Remplacement des requêtes SQL par un ORM

## Version 2.2 : utilisateurs
Ajout d'une authentification simple

## Version 3.0 : securisation
L'application est renforcée acec CORS, Helmet, HTTPS, etc.

# Utilisation des différentes versions
## Solution 1 : Cloner le projet terminé
Puis se déplacer vers les TAG concernées

Afficher les TAG : `git tag`

Aller à l'étape concernée : `git checkout etape1`

## Solution 2 : Cloner à partir du TAG
Récupérer directement le projet à partir du TAG pour avancer sans avoir plusieurs branches

Cloner l'étape concernée : `git clone --branch etape3 https://github.com/droumanet/TodoList-API.git`
