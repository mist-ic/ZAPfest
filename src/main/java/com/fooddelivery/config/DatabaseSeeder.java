package com.fooddelivery.config;

import com.fooddelivery.model.*;
import com.fooddelivery.model.enums.Role;
import com.fooddelivery.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }

        log.info("Seeding database...");
        seedUsers();
        seedRestaurants();
        log.info("Database seeding complete!");
    }

    private void seedUsers() {
        var admin = User.builder()
            .email("admin@zapfest.com")
            .password(passwordEncoder.encode("admin123"))
            .name("Admin User")
            .phone("9999999999")
            .role(Role.ADMIN)
            .build();

        var customer = User.builder()
            .email("customer@test.com")
            .password(passwordEncoder.encode("password123"))
            .name("John Doe")
            .phone("9876543210")
            .role(Role.CUSTOMER)
            .addresses(List.of(
                Address.builder().label("Home").address("123 Main St, Mumbai").lat(19.076).lng(72.877).build()
            ))
            .build();

        var owner1 = User.builder()
            .email("owner1@test.com")
            .password(passwordEncoder.encode("password123"))
            .name("Raj Sharma")
            .phone("9876543211")
            .role(Role.RESTAURANT_OWNER)
            .build();

        var owner2 = User.builder()
            .email("owner2@test.com")
            .password(passwordEncoder.encode("password123"))
            .name("Priya Patel")
            .phone("9876543212")
            .role(Role.RESTAURANT_OWNER)
            .build();

        var delivery = User.builder()
            .email("delivery@test.com")
            .password(passwordEncoder.encode("password123"))
            .name("Delivery Partner")
            .phone("9876543213")
            .role(Role.DELIVERY_PARTNER)
            .build();

        userRepository.saveAll(List.of(admin, customer, owner1, owner2, delivery));
        log.info("Created {} users", 5);
    }

    private void seedRestaurants() {
        var owner1 = userRepository.findByEmail("owner1@test.com").orElseThrow();
        var owner2 = userRepository.findByEmail("owner2@test.com").orElseThrow();

        // Restaurant 1: Spice Garden
        var r1 = restaurantRepository.save(Restaurant.builder()
            .ownerId(owner1.getId())
            .name("Spice Garden")
            .description("Authentic North Indian cuisine with rich flavors")
            .cuisines(List.of("North Indian", "Mughlai"))
            .rating(4.5)
            .totalReviews(120)
            .address(Address.builder().label("Main").address("456 Food Street, Mumbai").lat(19.082).lng(72.881).build())
            .build());

        menuItemRepository.saveAll(List.of(
            MenuItem.builder().restaurantId(r1.getId()).name("Butter Chicken").description("Creamy tomato chicken curry").price(350.0).category("Main Course").build(),
            MenuItem.builder().restaurantId(r1.getId()).name("Dal Makhani").description("Slow cooked black lentils").price(250.0).category("Main Course").build(),
            MenuItem.builder().restaurantId(r1.getId()).name("Garlic Naan").description("Soft naan with garlic").price(60.0).category("Breads").build(),
            MenuItem.builder().restaurantId(r1.getId()).name("Paneer Tikka").description("Grilled cottage cheese").price(280.0).category("Starters").build(),
            MenuItem.builder().restaurantId(r1.getId()).name("Gulab Jamun").description("Sweet milk dumplings").price(120.0).category("Desserts").build()
        ));

        // Restaurant 2: Dragon Wok
        var r2 = restaurantRepository.save(Restaurant.builder()
            .ownerId(owner1.getId())
            .name("Dragon Wok")
            .description("Indo-Chinese street food favorites")
            .cuisines(List.of("Chinese", "Indo-Chinese"))
            .rating(4.2)
            .totalReviews(85)
            .address(Address.builder().label("Main").address("789 China Town, Mumbai").lat(19.091).lng(72.865).build())
            .build());

        menuItemRepository.saveAll(List.of(
            MenuItem.builder().restaurantId(r2.getId()).name("Hakka Noodles").description("Stir fried noodles with veggies").price(220.0).category("Main Course").build(),
            MenuItem.builder().restaurantId(r2.getId()).name("Manchurian").description("Crispy veg balls in spicy sauce").price(200.0).category("Starters").build(),
            MenuItem.builder().restaurantId(r2.getId()).name("Fried Rice").description("Wok tossed rice with vegetables").price(200.0).category("Main Course").build(),
            MenuItem.builder().restaurantId(r2.getId()).name("Spring Rolls").description("Crispy rolls with veggie filling").price(180.0).category("Starters").build()
        ));

        // Restaurant 3: Pizza Paradise
        var r3 = restaurantRepository.save(Restaurant.builder()
            .ownerId(owner2.getId())
            .name("Pizza Paradise")
            .description("Wood-fired pizzas and Italian classics")
            .cuisines(List.of("Italian", "Pizza"))
            .rating(4.7)
            .totalReviews(200)
            .address(Address.builder().label("Main").address("321 Italian Lane, Mumbai").lat(19.072).lng(72.890).build())
            .build());

        menuItemRepository.saveAll(List.of(
            MenuItem.builder().restaurantId(r3.getId()).name("Margherita Pizza").description("Classic tomato and mozzarella").price(350.0).category("Pizza").build(),
            MenuItem.builder().restaurantId(r3.getId()).name("Pepperoni Pizza").description("Spicy pepperoni with cheese").price(450.0).category("Pizza").build(),
            MenuItem.builder().restaurantId(r3.getId()).name("Garlic Bread").description("Toasted bread with garlic butter").price(150.0).category("Sides").build(),
            MenuItem.builder().restaurantId(r3.getId()).name("Pasta Alfredo").description("Creamy white sauce pasta").price(320.0).category("Pasta").build(),
            MenuItem.builder().restaurantId(r3.getId()).name("Tiramisu").description("Classic Italian coffee dessert").price(250.0).category("Desserts").build()
        ));

        // Restaurant 4: Biryani House
        var r4 = restaurantRepository.save(Restaurant.builder()
            .ownerId(owner2.getId())
            .name("Biryani House")
            .description("Famous Hyderabadi Dum Biryani")
            .cuisines(List.of("Biryani", "Hyderabadi"))
            .rating(4.6)
            .totalReviews(150)
            .address(Address.builder().label("Main").address("555 Biryani Gali, Mumbai").lat(19.068).lng(72.872).build())
            .build());

        menuItemRepository.saveAll(List.of(
            MenuItem.builder().restaurantId(r4.getId()).name("Chicken Biryani").description("Dum cooked aromatic rice with chicken").price(320.0).category("Biryani").build(),
            MenuItem.builder().restaurantId(r4.getId()).name("Mutton Biryani").description("Slow cooked mutton biryani").price(420.0).category("Biryani").build(),
            MenuItem.builder().restaurantId(r4.getId()).name("Veg Biryani").description("Vegetable dum biryani").price(250.0).category("Biryani").build(),
            MenuItem.builder().restaurantId(r4.getId()).name("Raita").description("Cooling yogurt side").price(50.0).category("Sides").build(),
            MenuItem.builder().restaurantId(r4.getId()).name("Phirni").description("Rice pudding dessert").price(100.0).category("Desserts").build()
        ));

        // Restaurant 5: Burger Junction
        var r5 = restaurantRepository.save(Restaurant.builder()
            .ownerId(owner1.getId())
            .name("Burger Junction")
            .description("Juicy gourmet burgers and fries")
            .cuisines(List.of("American", "Fast Food"))
            .rating(4.3)
            .totalReviews(95)
            .address(Address.builder().label("Main").address("777 Burger Lane, Mumbai").lat(19.085).lng(72.888).build())
            .build());

        menuItemRepository.saveAll(List.of(
            MenuItem.builder().restaurantId(r5.getId()).name("Classic Burger").description("Beef patty with cheese and veggies").price(250.0).category("Burgers").build(),
            MenuItem.builder().restaurantId(r5.getId()).name("Chicken Burger").description("Crispy chicken with special sauce").price(220.0).category("Burgers").build(),
            MenuItem.builder().restaurantId(r5.getId()).name("Veggie Burger").description("Plant-based patty burger").price(200.0).category("Burgers").build(),
            MenuItem.builder().restaurantId(r5.getId()).name("French Fries").description("Crispy golden fries").price(120.0).category("Sides").build(),
            MenuItem.builder().restaurantId(r5.getId()).name("Milkshake").description("Thick creamy shake").price(150.0).category("Beverages").build()
        ));

        log.info("Created 5 restaurants with menu items");
    }
}
