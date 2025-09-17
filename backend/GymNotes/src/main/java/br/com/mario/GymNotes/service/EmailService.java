package br.com.mario.GymNotes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailReset(String to, String token) throws MessagingException {
        String link = "http://localhost:5173/reset?token=" + token;

        String html = """
            <h2>Redefinição de senha</h2>
            <p>Você solicitou a redefinição da sua senha.</p>
            <p>Clique no botão abaixo para redefinir:</p>
            <a href="%s" style="padding: 10px 20px; background-color: #007BFF; 
                                 color: white; text-decoration: none; border-radius: 5px;">
                Redefinir senha
            </a>
            <p>Se você não fez esta solicitação, ignore este e-mail.</p>
        """.formatted(link);

        MimeMessage mensagem = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensagem, true);

        helper.setTo(to);
        helper.setSubject("Reset de senha");
        helper.setText(html, true);
        helper.setFrom("mmmelhoresmemes@gmail.com");

        mailSender.send(mensagem);
    }
}
