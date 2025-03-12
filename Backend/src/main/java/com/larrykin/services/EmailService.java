package com.larrykin.services;

import com.larrykin.Request.EmailRequest;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Slf4j
@Service
public class EmailService {
    @Value("${SMTP_HOST}")
    private String SMTP_HOST;

    @Value("${SMTP_PORT}")
    private String SMTP_PORT;

    @Value("${EMAIL_USERNAME}")
    private String EMAIL_USERNAME;

    @Value("${EMAIL_PASSWORD}")
    private String EMAIL_PASSWORD;

    //send Email
    public Boolean sendEmail(EmailRequest emailRequest) {
        try {
            Properties props = new Properties();
            props.put("mail.smtp.host", SMTP_HOST);
            props.put("mail.smtp.port", SMTP_PORT);
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.ssl.enable", "true");

            Authenticator auth = new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(
                            EMAIL_USERNAME,
                            EMAIL_PASSWORD
                    );
                }
            };

            Session session = Session.getInstance(props, auth);

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(EMAIL_USERNAME));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(EMAIL_USERNAME));
            message.setSubject(emailRequest.getSubject());

            Transport.send(message);

            return true;
        } catch (Exception e) {
            log.error("EmailService:: Error sending email: {}", e.getMessage());
            e.printStackTrace();

            return false;
        }
    }

}
