package com.larrykin.services;

import com.larrykin.Request.EmailRequest;
import jakarta.activation.DataHandler;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Base64;
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


    //* send Email
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
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailRequest.getEmail()));
            message.setSubject(emailRequest.getSubject());

            Transport.send(message);

            return true;
        } catch (Exception e) {
            log.error("EmailService:: Error sending email: {}", e.getMessage());
            e.printStackTrace();

            return false;
        }
    }

    //* Send email with attachment
    public Boolean sendEmailWithAttachment(EmailRequest emailRequest, String qrCodeBase64) {
        if (emailRequest == null || emailRequest.getEmail() == null || emailRequest.getSubject() == null || emailRequest.getMessage() == null || qrCodeBase64 == null) {
            log.info("Qrcode: ", qrCodeBase64);
            log.info("EmailRequest:: ", emailRequest.toString());
            log.error("EmailRequest or QR code is null");
            return false;
        }
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
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(emailRequest.getEmail()));
            message.setSubject(emailRequest.getSubject());

            // create message part
            MimeBodyPart mimeBodyPart = new MimeBodyPart();
            mimeBodyPart.setText(emailRequest.getMessage());
            // create a multipart message
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(mimeBodyPart);

            //Convert Base64 String to byte array
            byte[] qrCodeBytes = Base64.getDecoder().decode(qrCodeBase64);

            //Create the attachment part
            MimeBodyPart attachmentBodyPart = new MimeBodyPart();
            attachmentBodyPart.setDataHandler(new DataHandler(new ByteArrayDataSource(qrCodeBytes, "image/png")));
            attachmentBodyPart.setFileName("qrcode.png");
            multipart.addBodyPart(attachmentBodyPart);

            message.setContent(multipart);

            Transport.send(message);
            log.info("Email sent successfully to {}", emailRequest.getEmail());
            return true;
        } catch (Exception e) {
            log.info("An error occurred sending email with attachment: {}", e.getMessage());
            log.info("Error:: " + e.toString());
            return false;
        }
    }


}
