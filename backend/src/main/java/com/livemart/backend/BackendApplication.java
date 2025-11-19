package com.livemart.backend;

import com.livemart.backend.model.Category;
import com.livemart.backend.model.Item;
import com.livemart.backend.model.Retailer;
import com.livemart.backend.model.Shop;
import com.livemart.backend.repository.CategoryRepository;
import com.livemart.backend.repository.ItemRepository;
import com.livemart.backend.repository.RetailerRepository;
import com.livemart.backend.repository.ShopRepository;

import java.time.LocalDate;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner loadDemoData(
        CategoryRepository catRepo,
        ItemRepository itemRepo,
        RetailerRepository retRepo,
        ShopRepository shopRepo // Inject Shop Repository
    ) 
    {
        return (args) -> {
            
            // --- MODULE 2 DATA (Only run if no categories exist) ---
            if (catRepo.count() == 0) {
                Category fruits = new Category(); fruits.setName("Fruits"); fruits.setImageUrl("url_to_image");
                Category grains = new Category(); grains.setName("Grains"); grains.setImageUrl("url_to_image");
                catRepo.save(fruits); catRepo.save(grains);

                Retailer r1 = new Retailer(); r1.setName("SuperMart"); r1.setWholesaler(false);
                Retailer w1 = new Retailer(); w1.setName("WholeMart"); w1.setWholesaler(true);
                retRepo.save(r1); retRepo.save(w1);

                Item apple = new Item();
                apple.setName("Apple");
                apple.setCategory(fruits);
                apple.setPrice(120.0); apple.setStock(50);
                apple.setAvailableDate(LocalDate.now());
                apple.setRetailer(r1);
                apple.setImageUrl("apple_url");
                itemRepo.save(apple);

                Item grainProxy = new Item();
                grainProxy.setName("Proxy Wheat");
                grainProxy.setCategory(grains);
                grainProxy.setRetailer(r1);
                grainProxy.setWholesalerSource(w1);
                grainProxy.setStock(30);
                grainProxy.setPrice(50.0);
                grainProxy.setAvailableDate(LocalDate.now().plusDays(2));
                grainProxy.setImageUrl("grain_url"); 
                itemRepo.save(grainProxy);
            } 
            
            // --- MODULE 3 LOCATION DATA (Only run if no shops exist) ---
            if (shopRepo.count() == 0) { 
                
                // Shop 1: Coordinates near Mumbai, India (Bandra)
                Shop s1 = new Shop();
                s1.setName("Fresh Grocery - Bandra");
                s1.setLatitude(19.05); 
                s1.setLongitude(72.85); 
                shopRepo.save(s1);

                // Shop 2: ~10 km away (Andheri)
                Shop s2 = new Shop();
                s2.setName("Quick Stop - Andheri");
                s2.setLatitude(19.11); 
                s2.setLongitude(72.86);
                shopRepo.save(s2);

                // Item at Shop 1
                Item itemA = new Item();
                itemA.setName("Organic Milk");
                itemA.setShop(s1);
                itemA.setPrice(5.50); 
                itemA.setStockQuantity(100); 
                itemRepo.save(itemA);

                // Item at Shop 2
                Item itemB = new Item();
                itemB.setName("Artisan Bread");
                itemB.setShop(s2);
                itemB.setPrice(4.00); 
                itemB.setStockQuantity(50); 
                itemRepo.save(itemB);
            }
        };
    }
}