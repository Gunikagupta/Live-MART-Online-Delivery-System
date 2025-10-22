package com.livemart.backend;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.livemart.backend.model.Category;
import com.livemart.backend.model.Item;
import com.livemart.backend.model.Retailer;
import com.livemart.backend.repository.CategoryRepository;
import com.livemart.backend.repository.ItemRepository;
import com.livemart.backend.repository.RetailerRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}
	@Bean
public CommandLineRunner loadDemoData(
    CategoryRepository catRepo,
    ItemRepository itemRepo,
    RetailerRepository retRepo
    ) 
	{
    return (args) -> {
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
            apple.setRetailer(r1); // this retailer's actual stock
            apple.setImageUrl("apple_url");
            itemRepo.save(apple);

            Item grainProxy = new Item();
            grainProxy.setName("Proxy Wheat");
            grainProxy.setCategory(grains);
            grainProxy.setRetailer(r1); // show as if offered by retailer
            grainProxy.setWholesalerSource(w1); // but backed by wholesaler
            grainProxy.setStock(30);
            grainProxy.setPrice(50.0);
            grainProxy.setAvailableDate(LocalDate.now().plusDays(2));
            grainProxy.setImageUrl("grain_url"); 
			itemRepo.save(grainProxy);
        }   
	};
	}
}
