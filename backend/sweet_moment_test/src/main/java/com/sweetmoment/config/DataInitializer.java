package com.sweetmoment.config;

import com.sweetmoment.shared.entity.*;
import com.sweetmoment.shared.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Map;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedData(
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            InventoryRepository inventoryRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository,
            PasswordEncoder passwordEncoder,
            JdbcTemplate jdbcTemplate
    ) {
        return args -> {
            if (productRepository.count() == 0) {
                Map<String, Category> categories = Map.of(
                        "Gâteaux marocains", createCategory(categoryRepository, "Gâteaux marocains"),
                        "Pâtisseries françaises", createCategory(categoryRepository, "Pâtisseries françaises"),
                        "Glaciers", createCategory(categoryRepository, "Glaciers"),
                        "Chocolats", createCategory(categoryRepository, "Chocolats"),
                        "Viennoiseries", createCategory(categoryRepository, "Viennoiseries"),
                        "Gâteaux de fête", createCategory(categoryRepository, "Gâteaux de fête")
                );

                createProduct(productRepository, inventoryRepository, categories.get("Gâteaux marocains"), "Cornes de gazelle", 65, 50, "/images/Cornes_de_gazelles.jpeg", false, 98);
                createProduct(productRepository, inventoryRepository, categories.get("Gâteaux marocains"), "Chebakia au miel", 55, 40, "/images/chebakia.jpeg", false, 95);
                createProduct(productRepository, inventoryRepository, categories.get("Gâteaux marocains"), "Briouates sucrés", 45, 60, "/images/Briouat.jpeg", true, 88);
                createProduct(productRepository, inventoryRepository, categories.get("Gâteaux marocains"), "Fekkas amandes", 70, 35, "/images/fekkas.jpeg", false, 82);
                createProduct(productRepository, inventoryRepository, categories.get("Pâtisseries françaises"), "Éclair au café", 40, 30, "/images/Éclair_au_café.jpeg", false, 90);
                createProduct(productRepository, inventoryRepository, categories.get("Pâtisseries françaises"), "Mille-feuille vanille", 45, 25, "/images/Mille-feuille vanille.jpeg", true, 92);
                createProduct(productRepository, inventoryRepository, categories.get("Pâtisseries françaises"), "Fraisier classique", 180, 10, "/images/Fraisier_classique.jpeg", false, 96);
                createProduct(productRepository, inventoryRepository, categories.get("Pâtisseries françaises"), "Tarte citron meringuée", 160, 12, "/images/Tarte citron meringuée.jpeg", false, 89);
                createProduct(productRepository, inventoryRepository, categories.get("Glaciers"), "Vacherin glacé", 220, 8, "/images/Vacherin_glacé.jpeg", true, 84);
                createProduct(productRepository, inventoryRepository, categories.get("Glaciers"), "Bûche glacée", 280, 6, "/images/Bûche glacée.jpeg", false, 80);
                createProduct(productRepository, inventoryRepository, categories.get("Chocolats"), "Truffes noir 70%", 95, 40, "/images/Truffes_noir_70.jpeg", false, 87);
                createProduct(productRepository, inventoryRepository, categories.get("Chocolats"), "Mendiants assortis", 80, 35, "/images/Mendiants_assortis.jpeg", false, 78);
                createProduct(productRepository, inventoryRepository, categories.get("Chocolats"), "Pralinés au chocolat noir", 200, 40, "/images/pralinés_au chocolat_noir.jpeg", false, 88);
                createProduct(productRepository, inventoryRepository, categories.get("Chocolats"), "Cake cubes", 250, 80, "/images/Cake_cubes.jpeg", false, 85);
                createProduct(productRepository, inventoryRepository, categories.get("Viennoiseries"), "Croissant pur beurre", 18, 100, "/images/croissant.jpeg", false, 99);
                createProduct(productRepository, inventoryRepository, categories.get("Viennoiseries"), "Pain au chocolat", 20, 90, "/images/pain_au_chocolat.jpeg", false, 97);
                createProduct(productRepository, inventoryRepository, categories.get("Gâteaux de fête"), "Layer cake chocolat", 350, 5, "/images/layer_cake.jpeg", true, 94);
                createProduct(productRepository, inventoryRepository, categories.get("Gâteaux de fête"), "Wedding cake 3 étages", 800, 3, "/images/wedding_cake.jpeg", false, 91);
            }

            if (!userRepository.existsByEmail("client@sweetmoment.ma")) {
                // data.sql insere des IDs explicites ; H2 ne met pas toujours a jour le compteur IDENTITY
                restartH2Identity(jdbcTemplate, "users", "id");
                restartH2Identity(jdbcTemplate, "profiles", "id");

                User u = new User();
                u.setFirstName("Client");
                u.setLastName("Demo");
                u.setEmail("client@sweetmoment.ma");
                u.setPassword(passwordEncoder.encode("password123"));
                userRepository.save(u);

                Profile p = new Profile();
                p.setUser(u);
                p.setCity("Casablanca");
                p.setPhone("0600000000");
                profileRepository.save(p);
            }
        };
    }

    private static void restartH2Identity(JdbcTemplate jdbc, String table, String idColumn) {
        Long max = jdbc.queryForObject(
                "SELECT COALESCE(MAX(" + idColumn + "), 0) FROM " + table,
                Long.class);
        jdbc.execute("ALTER TABLE " + table + " ALTER COLUMN " + idColumn + " RESTART WITH " + (max + 1));
    }

    private Category createCategory(CategoryRepository repo, String name) {
        Category c = new Category();
        c.setName(name);
        c.setDescription(name);
        return repo.save(c);
    }

    private void createProduct(ProductRepository pRepo, InventoryRepository iRepo, Category category,
                               String name, int price, int stock, String image, boolean isNew, int popularity) {
        Product p = new Product();
        p.setName(name);
        p.setCategory(category);
        p.setPrice(BigDecimal.valueOf(price));
        p.setDescription(name + " - produit artisanal");
        p.setImage(image);
        p.setImageFallback(image);
        p.setNew(isNew);
        p.setPopularity(popularity);
        pRepo.save(p);

        Inventory inv = new Inventory();
        inv.setProduct(p);
        inv.setQuantity(stock);
        iRepo.save(inv);
    }
}
