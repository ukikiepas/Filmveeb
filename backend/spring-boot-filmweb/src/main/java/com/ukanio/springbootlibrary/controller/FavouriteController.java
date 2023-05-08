package com.ukanio.springbootlibrary.controller;


import com.ukanio.springbootlibrary.dao.FavouriteRepository;
import com.ukanio.springbootlibrary.entity.Favourite;
import com.ukanio.springbootlibrary.requestmodels.AddMovieRequest;
import com.ukanio.springbootlibrary.service.FavouriteService;
import com.ukanio.springbootlibrary.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/favourite")
public class FavouriteController {

    private FavouriteRepository favouriteRepository;
    private FavouriteService favouriteService;

    public FavouriteController(FavouriteRepository favouriteRepository, FavouriteService favouriteService) {
        this.favouriteRepository = favouriteRepository;
        this.favouriteService = favouriteService;
    }

    @GetMapping("/secure/getFavourites")
    public List<Favourite> getFavourites(@RequestHeader(value = "Authorization") String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return favouriteRepository.findByUserEmail(userEmail);
    }

    @GetMapping("/secure/isFavourited")
    public boolean isFavourited(@RequestParam Long movieId, @RequestHeader(value = "Authorization") String token){
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        return favouriteService.isMovieFavourited(userEmail, movieId);
    }

    // do dodawania do ulubionych filmow
    @PostMapping("/secure/postFavourited")
    public void postFavourited(@RequestParam Long movieId, @RequestHeader(value = "Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        favouriteService.postFavourite(userEmail, movieId);
    }

    @DeleteMapping("/secure/deleteFavourited")
    public void deleteFavourited(@RequestParam Long movieId, @RequestHeader(value = "Authorization") String token) throws Exception{
        String userEmail = ExtractJWT.payloadJWTExtraction(token, "\"sub\"");
        favouriteService.deleteFavourite(userEmail, movieId);
    }

}
