# API Voyages Sécurisée


## Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Destinations
- `GET /api/destinations` - Liste des destinations (avec pagination/filtrage)
- `GET /api/destinations/:id` - Détail d'une destination
- `POST /api/destinations` - Créer une destination (Admin)
- `PUT /api/destinations/:id` - Modifier une destination (Admin)
- `DELETE /api/destinations/:id` - Supprimer une destination (Admin)

### Réservations
- `GET /api/reservations` - Toutes les réservations (Admin)
- `GET /api/reservations/my-reservations` - Mes réservations
- `POST /api/reservations` - Créer une réservation
- `PATCH /api/reservations/:id/status` - Modifier le statut
- `DELETE /api/reservations/:id` - Supprimer une réservation (Admin)