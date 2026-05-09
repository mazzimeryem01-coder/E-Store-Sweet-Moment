INSERT INTO categories (id, name, description) VALUES
(1, 'Gâteaux marocains', 'Gâteaux marocains'),
(2, 'Pâtisseries françaises', 'Pâtisseries françaises'),
(3, 'Glaciers', 'Glaciers'),
(4, 'Chocolats', 'Chocolats'),
(5, 'Viennoiseries', 'Viennoiseries'),
(6, 'Gâteaux de fête', 'Gâteaux de fête');

INSERT INTO products (id, name, price, image, image_fallback, description, is_new, popularity, category_id) VALUES
(1, 'Cornes de gazelle', 65.00, '/images/Cornes_de_gazelles.jpeg', '/images/Cornes_de_gazelles.jpeg', 'Cornes de gazelle - produit artisanal', FALSE, 98, 1),
(2, 'Chebakia au miel', 55.00, '/images/chebakia.jpeg', '/images/chebakia.jpeg', 'Chebakia au miel - produit artisanal', FALSE, 95, 1),
(3, 'Briouates sucrés', 45.00, '/images/Briouat.jpeg', '/images/Briouat.jpeg', 'Briouates sucrés - produit artisanal', TRUE, 88, 1),
(4, 'Fekkas amandes', 70.00, '/images/fekkas.jpeg', '/images/fekkas.jpeg', 'Fekkas amandes - produit artisanal', FALSE, 82, 1),
(5, 'Éclair au café', 40.00, '/images/Éclair_au_café.jpeg', '/images/Éclair_au_café.jpeg', 'Éclair au café - produit artisanal', FALSE, 90, 2),
(6, 'Mille-feuille vanille', 45.00, '/images/Mille-feuille vanille.jpeg', '/images/Mille-feuille vanille.jpeg', 'Mille-feuille vanille - produit artisanal', TRUE, 92, 2),
(7, 'Fraisier classique', 180.00, '/images/Fraisier_classique.jpeg', '/images/Fraisier_classique.jpeg', 'Fraisier classique - produit artisanal', FALSE, 96, 2),
(8, 'Tarte citron meringuée', 160.00, '/images/Tarte citron meringuée.jpeg', '/images/Tarte citron meringuée.jpeg', 'Tarte citron meringuée - produit artisanal', FALSE, 89, 2),
(9, 'Vacherin glacé', 220.00, '/images/Vacherin_glacé.jpeg', '/images/Vacherin_glacé.jpeg', 'Vacherin glacé - produit artisanal', TRUE, 84, 3),
(10, 'Bûche glacée', 280.00, '/images/Bûche glacée.jpeg', '/images/Bûche glacée.jpeg', 'Bûche glacée - produit artisanal', FALSE, 80, 3),
(11, 'Truffes noir 70%', 95.00, '/images/Truffes_noir_70.jpeg', '/images/Truffes_noir_70.jpeg', 'Truffes noir 70% - produit artisanal', FALSE, 87, 4),
(12, 'Mendiants assortis', 80.00, '/images/Mendiants_assortis.jpeg', '/images/Mendiants_assortis.jpeg', 'Mendiants assortis - produit artisanal', FALSE, 78, 4),
(13, 'Pralinés au chocolat noir', 200.00, '/images/pralinés_au chocolat_noir.jpeg', '/images/pralinés_au chocolat_noir.jpeg', 'Pralinés au chocolat noir - produit artisanal', FALSE, 88, 4),
(14, 'Cake cubes', 250.00, '/images/Cake_cubes.jpeg', '/images/Cake_cubes.jpeg', 'Cake cubes - produit artisanal', FALSE, 85, 4),
(15, 'Croissant pur beurre', 18.00, '/images/croissant.jpeg', '/images/croissant.jpeg', 'Croissant pur beurre - produit artisanal', FALSE, 99, 5),
(16, 'Pain au chocolat', 20.00, '/images/pain_au_chocolat.jpeg', '/images/pain_au_chocolat.jpeg', 'Pain au chocolat - produit artisanal', FALSE, 97, 5),
(17, 'Layer cake chocolat', 350.00, '/images/layer_cake.jpeg', '/images/layer_cake.jpeg', 'Layer cake chocolat - produit artisanal', TRUE, 94, 6),
(18, 'Wedding cake 3 étages', 800.00, '/images/wedding_cake.jpeg', '/images/wedding_cake.jpeg', 'Wedding cake 3 étages - produit artisanal', FALSE, 91, 6);

INSERT INTO inventories (id, quantity, product_id) VALUES
(1, 50, 1),
(2, 40, 2),
(3, 60, 3),
(4, 35, 4),
(5, 30, 5),
(6, 25, 6),
(7, 10, 7),
(8, 12, 8),
(9, 8, 9),
(10, 6, 10),
(11, 40, 11),
(12, 35, 12),
(13, 40, 13),
(14, 80, 14),
(15, 100, 15),
(16, 90, 16),
(17, 5, 17),
(18, 3, 18);

INSERT INTO users (id, first_name, last_name, email, password, created_at) VALUES
(1, 'Admin', 'Sweet', 'admin@sweetmoment.com', 'password123', CURRENT_TIMESTAMP),
(2, 'Salma', 'Berrada', 'salma@example.com', 'password123', CURRENT_TIMESTAMP);


INSERT INTO profiles (id, phone, address, city, country, user_id) VALUES
(1, '0612345678', 'Angle Rue 10 et 15', 'Casablanca', 'Maroc', 1),
(2, '0698765432', 'Boulevard Zerktouni', 'Casablanca', 'Maroc', 2);

INSERT INTO carts (id, created_at, user_id) VALUES
(1, CURRENT_TIMESTAMP, 1),
(2, CURRENT_TIMESTAMP, 2);


INSERT INTO reviews (id, product_id, user_id, author_name, rating, comment, created_at) VALUES
(1, 1, 2, 'Salma B.', 5, 'Les meilleures cornes de gazelle de Casablanca !', CURRENT_TIMESTAMP),
(2, 15, 1, 'Admin', 4, 'Très bon croissant, bien croustillant.', CURRENT_TIMESTAMP);


INSERT INTO customer_orders (id, order_date, total_amount, status, shipping_address, user_id) VALUES
(1, CURRENT_TIMESTAMP, 83.00, 'DELIVERED', 'Boulevard Zerktouni, Casablanca', 2);


INSERT INTO order_items (id, quantity, unit_price, order_id, product_id) VALUES
(1, 1, 65.00, 1, 1),
(2, 1, 18.00, 1, 15);



INSERT INTO cart_items (id, quantity, unit_price, cart_id, product_id) VALUES
(1, 2, 18.00, 1, 15),
(2, 1, 40.00, 1, 5);



