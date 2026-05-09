# Check Finale Prof - Backend Sweet Full (H2)

## 1) Conformité cahier des charges

### Architecture imposée
- [x] Backend Spring Boot Maven
- [x] Organisation par domaines: `customer`, `catalog`, `inventory`, `shopping`, `billing`, `review`
- [x] Couches séparées: `controller`, `service`, `repository`, `entity`, `dto`, `exception`, `config`

### Base de données
- [x] Base unique **H2** (aucun MongoDB, aucun MySQL)
- [x] JPA/Hibernate configuré
- [x] Données initiales injectées (`DataInitializer`)

### Domaines fonctionnels
- [x] Customer: register, login, profil, update profil
- [x] Catalog: liste produits, détail produit, catégories, recherche/tri/pagination
- [x] Inventory: lecture + mise à jour stock
- [x] Shopping: panier complet (ajout, update quantité, suppression, clear)
- [x] Billing: création commande + historique + détail
- [x] Reviews: création + lecture avis (implémenté en H2/JPA)

### Exigences métier
- [x] Vérification stock à l'ajout panier
- [x] Vérification stock à la commande
- [x] Décrément stock après validation commande
- [x] Panier vidé après commande
- [x] Total commande calculé (livraison 0 si sous-total > 500, sinon 30)
- [x] Validation des champs côté backend
- [x] Gestion d'erreurs globale (400/404/500)

## 2) Contrat API final

### Customer
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/users/{userId}`
- `PUT /api/users/{userId}`

### Catalog
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/categories`

### Inventory
- `GET /api/inventory/{productId}`
- `PUT /api/inventory`

### Shopping
- `GET /api/cart/{userId}`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/remove/{itemId}`
- `DELETE /api/cart/clear/{userId}`

### Billing
- `POST /api/orders`
- `GET /api/orders/user/{userId}`
- `GET /api/orders/{orderId}`

### Reviews
- `POST /api/reviews`
- `GET /api/reviews/product/{productId}`

## 3) Configuration exécution IntelliJ

## Pré-requis
- JDK 17
- IntelliJ avec support Maven

## Lancement
1. Ouvrir le dossier `sweet_Full_Backend` comme projet Maven.
2. Attendre l'indexation + téléchargement dépendances.
3. Vérifier le SDK du projet = **Java 17**.
4. Lancer `SweetFullBackendApplication`.
5. Tester: [http://localhost:8080/api/products](http://localhost:8080/api/products)

## H2 Console
- URL: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
- JDBC: `jdbc:h2:file:./data/sweetdb;AUTO_SERVER=TRUE`
- User: `sa`
- Password: *(vide)*

## 4) Compte et données de test
- Compte seed:
  - email: `client@sweetmoment.ma`
  - password: `password123`
- 18 produits + catégories + stock injectés au démarrage.

## 5) Mini plan de test rapide (prof)

1. `POST /api/auth/login` avec compte test -> 200
2. `GET /api/products?page=1&pageSize=8` -> 200 + `items`
3. `GET /api/cart/1` -> panier initial
4. `POST /api/cart/add` (`userId=1`, `productId=1`, `quantity=2`) -> 200
5. `POST /api/orders` (`userId=1`) -> 200 + commande créée
6. `GET /api/orders/user/1` -> liste commandes non vide
7. `POST /api/reviews` -> avis créé
8. `GET /api/reviews/product/1` -> avis visible

## 6) Note pédagogique importante
- Le cahier initial propose MongoDB pour le module documentaire.
- Cette version respecte ta contrainte stricte: **module reviews réalisé en JPA/H2** avec endpoints identiques.
