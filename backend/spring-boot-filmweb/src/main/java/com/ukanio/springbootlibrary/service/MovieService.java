package com.ukanio.springbootlibrary.service;


import com.ukanio.springbootlibrary.dao.CheckoutRepository;
import com.ukanio.springbootlibrary.dao.HistoryRepository;
import com.ukanio.springbootlibrary.dao.MovieRepository;
import com.ukanio.springbootlibrary.dao.PaymentRepository;
import com.ukanio.springbootlibrary.entity.Checkout;
import com.ukanio.springbootlibrary.entity.History;
import com.ukanio.springbootlibrary.entity.Movie;
import com.ukanio.springbootlibrary.entity.Payment;
import com.ukanio.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
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

    private PaymentRepository paymentRepository;

    public MovieService(MovieRepository movieRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository, PaymentRepository paymentRepository) {
        this.movieRepository = movieRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;
        this.paymentRepository = paymentRepository;
    }

    public Movie checkoutMovie(String userEmail, Long movieId) throws Exception {

        Optional<Movie> movie = movieRepository.findById(movieId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndMovieId(userEmail, movieId);

        if(!movie.isPresent() || validateCheckout != null || movie.get().getCopiesAvailable() <= 0){
            throw new Exception("Nie ma takiego filmu albo juz zajęty ");
        }

        // do platnosci
        List<Checkout> currentMoviesCheckedOut = checkoutRepository.findMoviesByUserEmail(userEmail);
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        boolean movieNeedsReturn = false;

        Date d2 = simpleDateFormat.parse(LocalDate.now().toString());
        TimeUnit timeUnit = TimeUnit.DAYS;
        for(Checkout checkout: currentMoviesCheckedOut){
            Date d1 = simpleDateFormat.parse(checkout.getReturnDate());
            double differenceInTime = timeUnit.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);
            if(differenceInTime < 0){
                movieNeedsReturn = true;
                break;
            }
        }

        Payment userPayment = paymentRepository.findByUserEmail(userEmail);

        if((userPayment != null) && userPayment.getAmount() >0 || (userPayment !=null && movieNeedsReturn)){
            throw new Exception("Nieoplacony film !!");
        }

        if(userPayment == null){
            Payment payment = new Payment();
            //payment.setId();
            payment.setAmount(00.00);
            payment.setUserEmail(userEmail);
            paymentRepository.save(payment);
        }

        //koniec platnosci ! :)




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

        // start "opłat za film"
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date d1 = simpleDateFormat.parse(validateCheckout.getReturnDate());
        Date d2 = simpleDateFormat.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;

        double differenceInTime = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);

        if(differenceInTime < 0){
            Payment payment = paymentRepository.findByUserEmail(userEmail);
            payment.setAmount(payment.getAmount() + (differenceInTime * -1));
            paymentRepository.save(payment);
        }
        //koniec oplat



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


    //logika do zwracania loswego id filmu co 24h :) :)

    private Long currentMovieId;
    private LocalDateTime lastMovieUpdate;

    private boolean shouldUpdateMovieId() {
        if (lastMovieUpdate == null) {
            return true; // Jeśli jeszcze nie ustawiono numeru, należy go zaktualizować
        }

        LocalDateTime now = LocalDateTime.now();
        return Duration.between(lastMovieUpdate, now).toHours() >= 24;
    }

    private Long randomMovieId() {
        long amountOfMovies = movieRepository.count();
        if (amountOfMovies == 0) {
            return -1L; // Brak filmów w bazie danych, zwróć odpowiednią wartość
        }

        Random random = new Random();
        int range = Math.toIntExact(amountOfMovies);
        int randomNumber = random.nextInt(range) + 1;

        return (long) randomNumber;
    }

    public Long getRandomMovieId() {
        if (shouldUpdateMovieId()) {
            // Jeśli minęło 24 godziny, zaktualizuj numer filmu dnia
            currentMovieId = randomMovieId();
            System.out.println(currentMovieId);
            lastMovieUpdate = LocalDateTime.now();
        }

        return currentMovieId;
    }




}

































