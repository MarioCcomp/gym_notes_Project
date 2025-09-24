package br.com.mario.GymNotes.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarEmailReset(String to, String token) throws MessagingException, IOException {
        String link = "http://localhost:5173/reset?token=" + token;

        String html = """
<html>
<head>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(180deg, #1e1e1e, #121212);
            color: #f1f1f1;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 2rem;
            background: #2c2c2c;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        h2 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            color: #00bfff;
        }
        p {
            font-size: 1.05rem;
            margin: 0.5rem 0 1.5rem 0;
            line-height: 1.6;
            color: #ffffff; /* Mais contraste */
            text-shadow: 0 1px 2px rgba(0,0,0,0.4); /* melhora leitura */
        }
        .button {
            display: inline-block;
            padding: 0.8rem 2rem;
            font-weight: bold;
            font-size: 1rem;
            color: #fff;
            background-color: #00bfff;
            text-decoration: none;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0, 191, 255, 0.25);
            transition: transform 0.15s ease, background-color 0.25s ease,
                        box-shadow 0.25s ease;
        }
        .button:hover {
            background-color: #1e90ff;
            transform: scale(1.05);
            box-shadow: 0 6px 18px rgba(0, 191, 255, 0.35);
        }
        .button:active {
            transform: scale(0.97);
            box-shadow: 0 2px 12px rgba(0, 191, 255, 0.4);
        }
        .footer {
            margin-top: 2rem;
            font-size: 0.85rem;
            color: #bbbbbb;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Redefinição de senha</h2>
        <p>Você solicitou a redefinição da sua senha no GymNotes.</p>
        <a href="%s" class="button">Redefinir senha</a>
        <div class="footer">
            <p>Se você não fez esta solicitação, apenas ignore este e-mail.</p>
        </div>
    </div>
</body>
</html>
""".formatted(link);

        MimeMessage mensagem = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mensagem, true);

        helper.setTo(to);
        helper.setSubject("Redefinição de senha - GymNotes");
        helper.setText(html, true);
        helper.setFrom("mariopereiradecj@gmail.com");

        mailSender.send(mensagem);
    }
}
