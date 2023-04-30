package com.ukanio.springbootlibrary.service;


import com.ukanio.springbootlibrary.dao.MovieRepository;
import com.ukanio.springbootlibrary.entity.Movie;
import com.ukanio.springbootlibrary.requestmodels.AddBookRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service
@Transactional
public class AdminService {


    private MovieRepository movieRepository;

    public AdminService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public void postBook(AddBookRequest addBookRequest){
        Movie movie = new Movie();
        movie.setTitle(addBookRequest.getTitle());
        movie.setDescription(addBookRequest.getDescription());
        movie.setDirector(addBookRequest.getDirector());
        movie.setCopies(addBookRequest.getCopies());
        movie.setCopiesAvailable(addBookRequest.getCopies());
        movie.setCategory(addBookRequest.getCategory());
        movie.setImg(addBookRequest.getImg());
        movieRepository.save(movie);
    }
}
