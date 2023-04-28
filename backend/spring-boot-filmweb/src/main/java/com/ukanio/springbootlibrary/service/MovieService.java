package com.ukanio.springbootlibrary.service;


import com.ukanio.springbootlibrary.dao.CheckoutRepository;
import com.ukanio.springbootlibrary.dao.HistoryRepository;
import com.ukanio.springbootlibrary.dao.MovieRepository;
import com.ukanio.springbootlibrary.entity.Checkout;
import com.ukanio.springbootlibrary.entity.History;
import com.ukanio.springbootlibrary.entity.Movie;
import com.ukanio.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
/*
Transakcja to jednostka pracy, która musi zostać wykonana w całości, albo wcale. Oznaczenie metody adnotacją @Transactional informuje Springa, aby zaangażował mechanizmy transakcyjne
przed uruchomieniem metody i aby wycofał transakcję w przypadku wystąpienia błędu. W ten sposób zapewnia, że ​​wszystkie zmiany wprowadzone do bazy danych podczas wykonywania
metody zostaną zatwierdzone, tylko gdy metoda zostanie zakończona poprawnie.

Użycie adnotacji @Transactional w aplikacjach opartych na Springu jest ważne dla utrzymania spójności danych i uniknięcia sytuacji, w których część operacji jest zatwierdzana, a reszta
nie, co może prowadzić do błędów w działaniu aplikacji.
 */
@Transactional
public class MovieService {


    private MovieRepository movieRepository;
    private CheckoutRepository checkoutRepository;

    private HistoryRepository historyRepository;

    public MovieService(MovieRepository movieRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository) {
        this.movieRepository = movieRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
    }

    public Movie checkoutMovie(String userEmail, Long movieId) throws Exception {

        Optional<Movie> movie = movieRepository.findById(movieId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndMovieId(userEmail, movieId);

        if(!movie.isPresent() || validateCheckout != null || movie.get().getCopiesAvailable() <= 0){
            throw new Exception("Nie ma takiego filmu albo juz zajęty ");
        }

        movie.get().setCopiesAvailable(movie.get().getCopiesAvailable() -1);
        movieRepository.save(movie.get());

        Checkout checkout = new Checkout(
                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),
                movie.get().getId()
        );

        checkoutRepository.save(checkout);

        return movie.get();

    }

    public Boolean checkoutMovieByUser(String userEmail, Long movieId){
        Checkout validateCheckout = checkoutRepository.findByUserEmailAndMovieId(userEmail, movieId);
        if(validateCheckout != null){
            return true;
        }else {
            return false;
        }
    }

    public int currentLoansCount(String userEmail){
        return checkoutRepository.findMoviesByUserEmail(userEmail).size();
    }

    public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception{

        List<ShelfCurrentLoansResponse> shelfCurrentLoansResponses = new ArrayList<>();

        // lista wszystkich ksiazek ktore user ma wypozyczone ( tylko movieID dostaniemy)
        List<Checkout> checkoutList = checkoutRepository.findMoviesByUserEmail(userEmail);
        List<Long> movieIdList = new ArrayList<>();

        // tutaj zabpisujemy do movieIdList wszystkie id.
        for(Checkout i: checkoutList){
            movieIdList.add(i.getMovieId());
        }


        List<Movie> movies = movieRepository.findMoviesByMovieIds(movieIdList);

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        for(Movie movie: movies){
            Optional<Checkout> checkout = checkoutList.stream()
                    .filter(x -> x.getMovieId() == movie.getId()).findFirst();

            if(checkout.isPresent()){

                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(),TimeUnit.MILLISECONDS);

                shelfCurrentLoansResponses.add(new ShelfCurrentLoansResponse(movie, (int) difference_In_Time));

            }

        }

        return shelfCurrentLoansResponses;

    }

    public void returnBook(String userEmail, Long movieId) throws Exception {

        Optional<Movie> movie = movieRepository.findById(movieId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndMovieId(userEmail, movieId);

        if(!movie.isPresent() || validateCheckout == null ){
            throw new Exception("Nie ma takiego filmu albo nie ma go dany user wypozyczonego");
        }

        movie.get().setCopiesAvailable(movie.get().getCopiesAvailable() + 1);

        movieRepository.save(movie.get());
        checkoutRepository.deleteById(validateCheckout.getId());

        // od tego momentu tutaj wdupcam zeby było history repo git
        History history = new History(
                userEmail,
                validateCheckout.getCheckoutDate(),
                LocalDate.now().toString(),
                movie.get().getTitle(),
                movie.get().getDirector(),
                movie.get().getDescription(),
                movie.get().getImg()
        );

        historyRepository.save(history);

    }

    public void renewLoan(String userEmail, Long movieId) throws Exception {

        Optional<Movie> movie = movieRepository.findById(movieId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndMovieId(userEmail, movieId);

        if(!movie.isPresent() || validateCheckout == null ){
            throw new Exception("Nie ma takiego filmu albo nie ma go dany user wypozyczonego");
        }

        SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy-MM-dd");

        Date d1 = sdFormat.parse(validateCheckout.getReturnDate());
        Date d2 = sdFormat.parse(LocalDate.now().toString());

        // sprawdzam czy film ma jeszcze jakieś dni lub czy dzien oddania = dzis
        if(d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0){
            validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
            checkoutRepository.save(validateCheckout);
        }

    }

}

































