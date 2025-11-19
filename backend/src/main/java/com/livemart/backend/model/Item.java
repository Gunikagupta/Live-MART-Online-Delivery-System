    package com.livemart.backend.model;

    import jakarta.persistence.*;
    import java.time.LocalDate;

    @Entity
    public class Item {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        private String name;
        private String imageUrl;
        private Double price;

        // These fields MUST be Integer because DB can have NULL
        private Integer stock;

        @Column(name = "stock_quantity")
        private Integer stockQuantity;

        @Column(name = "available_date")
        private LocalDate availableDate;

        // Relationships
        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "shop_id")
        private Shop shop;

        @ManyToOne
        @JoinColumn(name = "category_id")
        private Category category;

        @ManyToOne
        @JoinColumn(name = "retailer_id")
        private Retailer retailer;

        @ManyToOne
        @JoinColumn(name = "source_wholesaler_id", nullable = true)
        private Retailer wholesalerSource;


        // ---------------------------
        //        Getters / Setters
        // ---------------------------

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }


        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }


        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }


        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }


        public Integer getStock() {
            return stock;
        }

        public void setStock(Integer stock) {
            this.stock = stock;
        }


        public Integer getStockQuantity() {
            return stockQuantity;
        }

        public void setStockQuantity(Integer stockQuantity) {
            this.stockQuantity = stockQuantity;
        }


        public LocalDate getAvailableDate() {
            return availableDate;
        }

        public void setAvailableDate(LocalDate availableDate) {
            this.availableDate = availableDate;
        }


        public Shop getShop() {
            return shop;
        }

        public void setShop(Shop shop) {
            this.shop = shop;
        }


        public Category getCategory() {
            return category;
        }

        public void setCategory(Category category) {
            this.category = category;
        }


        public Retailer getRetailer() {
            return retailer;
        }

        public void setRetailer(Retailer retailer) {
            this.retailer = retailer;
        }


        public Retailer getWholesalerSource() {
            return wholesalerSource;
        }

        public void setWholesalerSource(Retailer wholesalerSource) {
            this.wholesalerSource = wholesalerSource;
        }
    }
        