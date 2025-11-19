package com.livemart.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data     // <-- YOU MISSED THIS
public class ItemDTO {
    private Long id;
    private String name;
    private double price;
    private int stock;
    private String imageUrl;
    private LocalDate availableDate;
    private String stockStatus;
    private boolean proxyAvailable;
}
