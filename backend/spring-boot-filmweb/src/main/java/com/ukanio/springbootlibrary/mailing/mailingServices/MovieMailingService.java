package com.ukanio.springbootlibrary.mailing.mailingServices;


import com.ukanio.springbootlibrary.dao.MovieRepository;
import com.ukanio.springbootlibrary.entity.Movie;
import com.ukanio.springbootlibrary.mailing.EmailSenderServiceImpl;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.Optional;

@Service
public class MovieMailingService {


    private EmailSenderServiceImpl emailSenderService;
    private MovieRepository movieRepository;

    public MovieMailingService(EmailSenderServiceImpl emailSenderService, MovieRepository movieRepository) {
        this.emailSenderService = emailSenderService;
        this.movieRepository = movieRepository;
    }

    //mailing :)
    public void sendCheckoutConfirmation(String userEmail, Long movieId){
        LocalDate currentDate = LocalDate.now();
        LocalDate currentDate_plus7 = currentDate.plusDays(7);

        Optional<Movie> movie = movieRepository.findById(movieId);
        String subject = "Potwierdzenie wypożyczenia filmu - " + movie.get().getTitle();
        StringBuilder stringBuilder = new StringBuilder();
        stringBuilder.append("Cześć " + userEmail + "\n \n");
        stringBuilder.append("Dziękujemy za skorzystanie z usług naszej firmy. Pamiętaj, że darmowy czas wypożyczenia to 7 dni kalendarzowych, po tym czasie będziesz obciążony opłatą 1$ za każdy dzień zwłoki.\n \n");
        stringBuilder.append("Szczegóły filmu: \n");
        stringBuilder.append("Tytuł: " + movie.get().getTitle() + "\n");
        stringBuilder.append("Data wypożyczenia: " + currentDate + "\n");
        stringBuilder.append("Data oddania: " + currentDate_plus7 + "\n \n");
        stringBuilder.append("Pozdrawiamy i życzmy miłego seansu! \n");
        stringBuilder.append("Zespół Filmveb");

        String textMessage = stringBuilder.toString();


        emailSenderService.sendEmail(userEmail, subject, textMessage);
    }
}
