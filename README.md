# Movie Management API

## Description
Une API RESTful construite avec Hapi.js permettant la gestion de films, d'utilisateurs et de favoris avec authentification et notifications par email.

## Fonctionnalités

### Gestion des Utilisateurs
- Inscription avec email de bienvenue automatique
- Authentification par JWT
- Rôles utilisateur (admin/user)
- Gestion des profils

### Gestion des Films
- Opérations CRUD complètes
- Création et modification réservées aux admins
- Informations des films :
  - Titre
  - Description
  - Date de sortie
  - Réalisateur
  - Système de favoris

### Système de Favoris
- Ajout/suppression des films aux favoris
- Suivi des favoris par utilisateur
- Notifications email automatiques pour :
  - Nouveaux films ajoutés
  - Mises à jour des films favoris

### Authentification
- Basée sur JWT
- Contrôle d'accès basé sur les rôles
- Routes protégées selon les rôles utilisateur

### Base de données
- MySQL avec Knex
- Système de migrations
- Structure :
  - Table users
  - Table movies
  - Table movie_favorites

### Notifications Email
- Emails de bienvenue
- Notifications de nouveaux films
- Notifications de mise à jour
- Utilise Nodemailer avec Ethereal

## Installation

1. Cloner le projet :
```bash
git clone <repo-url>
cd iut-project
