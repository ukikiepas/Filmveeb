package com.ukanio.springbootlibrary.service;


import com.ukanio.springbootlibrary.dao.CheckoutRepository;
import com.ukanio.springbootlibrary.dao.MovieRepository;
import com.ukanio.springbootlibrary.dao.ReviewRepository;
import com.ukanio.springbootlibrary.entity.Movie;
import com.ukanio.springbootlibrary.requestmodels.AddMovieRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@Transactional
public class AdminService {


    private MovieRepository movieRepository;
    private CheckoutRepository checkoutRepository;
    private ReviewRepository reviewRepository;

    public AdminService(MovieRepository movieRepository, CheckoutRepository checkoutRepository, ReviewRepository reviewRepository) {
        this.movieRepository = movieRepository;
        this.checkoutRepository = checkoutRepository;
        this.reviewRepository = reviewRepository;
    }

    // do dodawania nowego filmu
    public void postMovie(AddMovieRequest addMovieRequest){
        Movie movie = new Movie();
        movie.setTitle(addMovieRequest.getTitle());
        movie.setDescription(addMovieRequest.getDescription());
        movie.setDirector(addMovieRequest.getDirector());
        movie.setCopies(addMovieRequest.getCopies());
        movie.setCopiesAvailable(addMovieRequest.getCopies());
        movie.setCategory(addMovieRequest.getCategory());
        movie.setImg(addMovieRequest.getImg());
        movieRepository.save(movie);
    }

    // do zwiekszania ilosci filmow do wypozyczenia
    public void increaseMovieQuantity(Long movieId) throws Exception{
        Optional<Movie> movie = movieRepository.findById(movieId);

        if(!movie.isPresent()){
            throw new Exception("Movie not found");
        }

        movie.get().setCopiesAvailable(movie.get().getCopiesAvailable() + 1);
        movie.get().setCopies(movie.get().getCopies() + 1);

        movieRepository.save(movie.get());
    }

    // do zmniejszania ilosci filmow do wypozyczenia
    public void decreaseMovieQuantity(Long movieId) throws Exception{
        Optional<Movie> movie = movieRepository.findById(movieId);

        if(!movie.isPresent() || movie.get().getCopiesAvailable() <=0 || movie.get().getCopies() <=0){
            throw new Exception("Movie not found or all rented");
        }

        movie.get().setCopiesAvailable(movie.get().getCopiesAvailable() -1 );
        movie.get().setCopies(movie.get().getCopies() - 1);

        movieRepository.save(movie.get());
    }

    // do usuwania filmow !
    public void deleteMovie(Long movieId) throws Exception{

        Optional<Movie> movie = movieRepository.findById(movieId);

        // dodac jakies zabezpieczneie ze jak wypozyczona to nie mozna :)
        if(!movie.isPresent()){
            throw new Exception("Movie not found");
        }

        movieRepository.delete(movie.get());
        checkoutRepository.deleteAllByMovieId(movieId);
        reviewRepository.deleteAllByMovieId(movieId);

    }
}
