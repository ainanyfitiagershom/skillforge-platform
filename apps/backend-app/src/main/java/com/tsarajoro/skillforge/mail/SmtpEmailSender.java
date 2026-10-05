package com.tsarajoro.skillforge.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;

/**
 * Envoi via JavaMail / SMTP (Spring Mail). Utilise pour le dev local
 * (Mailpit sur localhost:1026) et les hebergeurs qui autorisent le SMTP
 * sortant sur les ports standards.
 *
 * <p>Active quand skillforge.mail.provider=smtp (defaut).
 */
@Component
@ConditionalOnProperty(name = "skillforge.mail.provider", havingValue = "smtp", matchIfMissing = true)
public class SmtpEmailSender implements EmailSender {

    private final JavaMailSender mailSender;

    public SmtpEmailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void send(String to, String fromAddr, String fromName,
                     String subject, String html) throws EmailSendException {
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(fromAddr, fromName, StandardCharsets.UTF_8.name()));
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
        } catch (MessagingException | MailException | UnsupportedEncodingException e) {
            throw new EmailSendException("Envoi SMTP echoue : " + e.getMessage(), e);
        }
    }
}
