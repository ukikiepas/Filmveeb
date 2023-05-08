package com.ukanio.springbootlibrary.service;


import com.ukanio.springbootlibrary.dao.FavouriteRepository;
import com.ukanio.springbootlibrary.entity.Favourite;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class FavouriteService {

    private FavouriteRepository favouriteRepository;

    public FavouriteService(FavouriteRepository favouriteRepository) {
        this.favouriteRepository = favouriteRepository;
    }

    public boolean isMovieFavourited(String userEmail, Long movieId){

        if(favouriteRepository.findByUserEmailAndMovieId(userEmail, movieId).isPresent()){
            return true;
        }else{
            return false;
        }
    }

    // do dodawania
    public void postFavourite(String userEmail, Long movieId) throws Exception{
        Favourite favourite = new Favourite();
        favourite.setUserEmail(userEmail);
        favourite.setMovieId(movieId);
        Optional<Favourite> optionalFavourite = favouriteRepository.findByMovieId(favourite.getMovieId());
        if (optionalFavourite.isPresent()) {
            throw new Exception("There is already favourited movie in database") ;
        } else {
            // Obiekt nie istnieje w bazie danych
            favouriteRepository.save(favourite);
        }
    }

    //do usuwania
    public void deleteFavourite(String userEmail, Long movieId) throws Exception{
        Optional<Favourite> optionalFavourite = favouriteRepository.findByUserEmailAndMovieId(userEmail, movieId);
        if (optionalFavourite.isPresent()) {
            Favourite favourite = new Favourite();
            favourite.setId(optionalFavourite.get().getId());
            favourite.setUserEmail(optionalFavourite.get().getUserEmail());
            favourite.setMovieId(optionalFavourite.get().getMovieId());
            favouriteRepository.delete(favourite);
        } else {
            // Obiekt nie istnieje w bazie danych
            throw new Exception("There is no favourited movie in database") ;

        }

    }
}
