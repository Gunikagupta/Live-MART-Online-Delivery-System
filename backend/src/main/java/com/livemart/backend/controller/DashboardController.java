package com.livemart.backend.controller;

import com.livemart.backend.model.Category;
import com.livemart.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired 
    private CategoryRepository categoryRepo;

    // ONLY dashboard-level endpoints stay here
    @GetMapping("/categories")
    public List<Category> getCategories() {
        return categoryRepo.findAll();
    }
}
