package com.livemart.backend.controller;

import com.livemart.backend.model.Feedback;
import com.livemart.backend.repository.FeedbackRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    private final FeedbackRepository feedbackRepository;

    public FeedbackController(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping
    public Feedback submitFeedback(@RequestBody Feedback feedback) {
        feedback.setTimestamp(LocalDateTime.now());
        return feedbackRepository.save(feedback);
    }

    @GetMapping("/item/{itemId}")
    public List<Feedback> getFeedbackForItem(@PathVariable Long itemId) {
        return feedbackRepository.findByItemId(itemId);
    }
}
