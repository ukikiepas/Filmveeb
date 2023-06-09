package com.ukanio.springbootlibrary.controller;


import com.ukanio.springbootlibrary.entity.Movie;
import com.ukanio.springbootlibrary.mailing.EmailSenderServiceImpl;
import com.ukanio.springbootlibrary.mailing.mailingServices.MovieMailingService;
import com.ukanio.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import com.ukanio.springbootlibrary.service.MovieService;
import com.ukanio.springbootlibrary.utils.ExtractJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


// ta adnotacja robi to, że sie nie wypierdoli nam jak bedziemy chcieli z innego zrodla niz 8080 zapytać.
// (bo to poblokowane domyslnie jest w config -> MyDataRestConfig.
@CrossOrigin("https://localhost:3000")
@RestController
@RequestMapping("/api/movies")
public class MovieController {

    private MovieService movieService;
    private MovieMailingService movieMailingService;



    public MovieController(MovieService movieService, MovieMailingService movieMailingService) {
        this.movieService = movieService;
        this.movieMailingService = movieMailingService;

    }


    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return movieService.currentLoans(userEmail);
    }

    @GetMapping("/secure/currentloans/count")
    // tutaj dzieki RequestHeader wyciagam z nagowka cos co ma value Authorization
    // potem zapisuje sobie to jako token i bede z niego maila wyciagal
    public int currentLoansAmount(@RequestHeader(value = "Authorization") String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
            return movieService.currentLoansCount(userEmail);
        }


    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutMovieByUser(@RequestParam Long movieId, @RequestHeader(value = "Authorization") String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return movieService.checkoutMovieByUser(userEmail, movieId);
    }


    @PutMapping("/secure/checkout")
    public Movie checkoutMovie(@RequestParam Long movieId, @RequestHeader(value = "Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        movieMailingService.sendCheckoutConfirmation(userEmail, movieId);
        return movieService.checkoutMovie(userEmail, movieId);
    }


    // endpoint do zwracania filmow
    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token, @RequestParam Long movieId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        movieService.returnBook(userEmail, movieId);
    }

    //endpoint do przedluzania filmow
    @PutMapping("secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization") String token, @RequestParam Long movieId) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        movieService.renewLoan(userEmail, movieId);
    }


    //edpoint do filmu dnia -> losowe id filmu z bazy
    @GetMapping("/randomMovieId")
    public Long getRandomId(){
        return movieService.getRandomMovieId();
    }






}
