package com.ukanio.springbootlibrary.mailing.mailingServices;

import com.ukanio.springbootlibrary.dao.CheckoutRepository;
import com.ukanio.springbootlibrary.dao.MovieRepository;
import com.ukanio.springbootlibrary.entity.Checkout;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.stereotype.Component;
import com.ukanio.springbootlibrary.mailing.EmailSenderService;

import java.time.LocalDate;
import java.util.List;

@Component
public class MovieCheckoutReminder implements Job {

    // tutaj przekazuje interfejs bo mam tylko 1 implementacje i i tak ona zostanie zawsze dodana -> zawsze potem moge dodac @Qualifier
   private EmailSenderService emailSenderService;
   private CheckoutRepository checkoutRepository;
   private MovieRepository movieRepository;

    public MovieCheckoutReminder(EmailSenderService emailSenderService, CheckoutRepository checkoutRepository, MovieRepository movieRepository) {
        this.emailSenderService = emailSenderService;
        this.checkoutRepository = checkoutRepository;
        this.movieRepository = movieRepository;
    }

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
       List<Checkout> checkoutList = checkoutRepository.findAll();

       LocalDate localDate = LocalDate.now();
       for(Checkout checkout : checkoutList){

            LocalDate checkoutEndDate = LocalDate.parse(checkout.getReturnDate());

            if(checkoutEndDate.minusDays(1).equals(localDate)){
                String userEmail = checkout.getUserEmail();
                String movieTitle = movieRepository.findTitleById(checkout.getMovieId());
                String subject = "UWAGA! Został Ci jeden dzień na oddanie filmu - " + movieTitle;


                StringBuilder stringBuilder = new StringBuilder();
                stringBuilder.append("Cześć " + userEmail + "\n \n");
                stringBuilder.append("Dziękujemy za skorzystanie z usług naszej firmy. Pamiętaj, że pozotsał Ci jeden dzień na oddanie filmu! Po tym czasie będziesz obciążony opłatą 1$ za każdy dzień zwłoki.\n \n");
                stringBuilder.append("Szczegóły filmu: \n");
                stringBuilder.append("Tytuł: " + movieTitle + "\n");
                stringBuilder.append("Data wypożyczenia: " + checkout.getCheckoutDate() + "\n");
                stringBuilder.append("Data oddania: " + checkout.getReturnDate() + "\n \n");
                stringBuilder.append("Pozdrawiamy ! \n");
                stringBuilder.append("Zespół Filmveb");

                String textMessage = stringBuilder.toString();


                emailSenderService.sendEmail(userEmail, subject, textMessage);

            }


       }

    }
}

//@Component
//public class MovieCheckoutReminder implements Job {
//
//    private EmailSenderService emailSenderService;
//    private CheckoutRepository checkoutRepository;
//    private MovieRepository movieRepository;
//
//    public MovieCheckoutReminder(EmailSenderService emailSenderService, CheckoutRepository checkoutRepository, MovieRepository movieRepository) {
//        this.emailSenderService = emailSenderService;
//        this.checkoutRepository = checkoutRepository;
//        this.movieRepository = movieRepository;
//    }
//
//    @Override
//    public void execute(JobExecutionContext context) throws JobExecutionException {
//        List<Checkout> checkoutList = checkoutRepository.findAll();
//
//        LocalDate localDate = LocalDate.now();
//        for(Checkout checkout : checkoutList){
//
//            LocalDate checkoutEndDate = LocalDate.parse(checkout.getReturnDate());
//
//            if(checkoutEndDate.minusDays(1).equals(localDate)){
//                String userEmail = checkout.getUserEmail();
//                String movieTitle = movieRepository.findTitleById(checkout.getMovieId());
//                String subject = "UWAGA! Został Ci jeden dzień na oddanie filmu - " + movieTitle;
//
//                StringBuilder stringBuilder = new StringBuilder();
//                stringBuilder.append("Cześć " + userEmail + "<br><br>");
//                stringBuilder.append("Dziękujemy za skorzystanie z usług naszej firmy. <b style=\"color: #7EC8E3;\">Pamiętaj, że pozostał Ci jeden dzień na oddanie filmu!</b> Po tym czasie będziesz obciążony opłatą 1$ za każdy dzień zwłoki.<br><br>");
//                stringBuilder.append("Szczegóły filmu:<br>");
//                stringBuilder.append("<b>Tytuł:</b> " + movieTitle + "<br>");
//                stringBuilder.append("Data wypożyczenia: " + checkout.getCheckoutDate() + "<br>");
//                stringBuilder.append("Data oddania: " + checkout.getReturnDate() + "<br><br>");
//                stringBuilder.append("Pozdrawiamy!<br>");
//                stringBuilder.append("<span style=\"color: #7EC8E3;\">Zespół Filmveb</span>");
//
//                String textMessage = stringBuilder.toString();
//
//                emailSenderService.sendEmail(userEmail, subject, textMessage);
//            }
//        }
//    }
//}

