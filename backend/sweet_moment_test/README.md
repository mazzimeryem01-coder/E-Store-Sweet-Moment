# Sweet Full Backend (H2 only)

Backend Spring Boot fonctionnel pour le projet E-Store/Sweet Moment.

## Stack
- Java 17
- Spring Boot (Web, Data JPA, Validation, Security)
- Base de données **H2 uniquement** (pas MongoDB, pas MySQL)

## Lancer dans IntelliJ
1. Ouvrir le dossier `sweet_Full_Backend` comme projet Maven.
2. Laisser IntelliJ télécharger les dépendances Maven.
3. Lancer la classe `com.sweetmoment.SweetFullBackendApplication`.
4. Backend disponible sur `http://localhost:8080`.

## H2 Console
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:file:./data/sweetdb;AUTO_SERVER=TRUE`
- User: `sa`
- Password: *(vide)*

## API principales
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/{userId}`
- `PUT /api/users/{userId}`
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`
- `GET /api/cart/{userId}`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove/{itemId}`
- `DELETE /api/cart/clear/{userId}`
- `POST /api/orders`
- `GET /api/orders/user/{userId}`
- `GET /api/orders/{orderId}`
- `POST /api/reviews`
- `GET /api/reviews/product/{productId}`
- `GET /api/inventory/{productId}`
- `PUT /api/inventory`

## Compte de test
- Email: `client@sweetmoment.ma`
- Mot de passe: `password123`

## Remarque importante
Le cahier original demande MongoDB pour un module documentaire.
Dans cette version, selon ta contrainte, le module `reviews` est implémenté en JPA/H2 avec les mêmes endpoints.
