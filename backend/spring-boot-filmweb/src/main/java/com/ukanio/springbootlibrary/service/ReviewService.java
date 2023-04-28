package com.ukanio.springbootlibrary.service;


import com.ukanio.springbootlibrary.dao.ReviewRepository;
import com.ukanio.springbootlibrary.requestmodels.ReviewRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ukanio.springbootlibrary.entity.Review;

import java.sql.Date;
import java.time.LocalDate;

@Service
@Transactional
public class ReviewService {

    private ReviewRepository reviewRepository;

    //ta adnotacja nie jest wymagana, dodalem dla jasnoci
    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }


    // metoda do wyslania review do bazy
    // reviewRepository.save() to dokladnie robi :)
    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception{

        // tutaj sprawdzamy czy user nie ma juz review
        Review validateReview = reviewRepository.findByUserEmailAndMovieId(userEmail, reviewRequest.getMovieId());
        if(validateReview != null){
            throw new Exception("Review already created");
        }

        Review review = new Review();
        review.setMovieId(reviewRequest.getMovieId());
        review.setRating(reviewRequest.getRating());
        review.setUserEmail(userEmail);
        //tutaj musimy troche inaczej zapisac review description bo to jest optional
        if(reviewRequest.getReviewDescription().isPresent()){
            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                    Object::toString
            ).orElse(null));
        }

        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);

    }

    public Boolean userReviewListed(String userEmail, Long movieId){
        Review validateReview = reviewRepository.findByUserEmailAndMovieId(userEmail, movieId);
        if(validateReview != null){
            return true;
        }else {
            return false;
        }
    }

}
