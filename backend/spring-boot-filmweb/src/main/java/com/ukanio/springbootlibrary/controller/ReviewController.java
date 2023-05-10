package com.ukanio.springbootlibrary.controller;


import com.ukanio.springbootlibrary.requestmodels.ReviewRequest;
import com.ukanio.springbootlibrary.service.ReviewService;
import com.ukanio.springbootlibrary.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader(value = "Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception{

        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        reviewService.postReview(userEmail, reviewRequest);

    }

    @GetMapping("/secure/user/movie")
    public Boolean reviewMovieByUser(@RequestHeader(value = "Authorization") String token,
                                     @RequestParam Long movieId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        return reviewService.userReviewListed(userEmail, movieId);
    }

    @GetMapping("/secure/user/movie/rating")
    public double getMovieRatingByUser(@RequestHeader(value = "Authorization") String token,
                                    @RequestParam Long movieId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        return  reviewService.getMovieRatingByUser(userEmail, movieId);
    }

    @PutMapping("/secure/user/updateReview")
    public void updateReview(@RequestHeader(value = "Authorization") String token,
                             @RequestBody ReviewRequest reviewRequest) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        if(userEmail == null){
            throw new Exception("User email is missing");
        }
        reviewService.updateReview(userEmail, reviewRequest);

    }

}
