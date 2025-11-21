package com.livemart.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)  // Changed eager fetching
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)  // Changed eager fetching
    private Item item;

    private int rating; // e.g. 1-5
    private String comment;

    private LocalDateTime timestamp;

    // ----- Constructors -----

    public Feedback() {}

    public Feedback(User user, Item item, int rating, String comment, LocalDateTime timestamp) {
        this.user = user;
        this.item = item;
        this.rating = rating;
        this.comment = comment;
        this.timestamp = timestamp;
    }

    // ----- Getters and Setters -----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Item getItem() {
        return item;
    }

    public void setItem(Item item) {
        this.item = item;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
