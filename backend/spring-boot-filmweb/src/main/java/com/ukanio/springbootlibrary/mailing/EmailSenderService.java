package com.ukanio.springbootlibrary.mailing;




public interface EmailSenderService {

    void sendEmail(String to, String subject, String message);

}
