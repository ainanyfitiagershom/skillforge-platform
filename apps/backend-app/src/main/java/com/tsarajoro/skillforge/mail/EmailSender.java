package com.tsarajoro.skillforge.mail;

/**
 * Abstraction d envoi d email. Deux implementations :
 * <ul>
 *   <li>{@link SmtpEmailSender} : Spring Mail + JavaMail (dev local avec Mailpit,
 *       prod sur serveur avec SMTP ouvert).</li>
 *   <li>{@link ResendEmailSender} : API HTTPS Resend (prod cloud quand l hebergeur
 *       bloque les ports SMTP sortants, cas de Render Free).</li>
 * </ul>
 *
 * <p>Le choix se fait par la propriete {@code skillforge.mail.provider} :
 * {@code smtp} (defaut) ou {@code resend}.
 */
public interface EmailSender {

    /**
     * Envoie un email HTML.
     *
     * @param to       destinataire
     * @param fromAddr adresse expediteur
     * @param fromName nom expediteur affiche
     * @param subject  objet du mail
     * @param html     corps HTML (deja genere, pret a envoyer)
     * @throws EmailSendException en cas d echec reseau ou autre erreur fournisseur
     */
    void send(String to, String fromAddr, String fromName, String subject, String html)
            throws EmailSendException;

    class EmailSendException extends Exception {
        public EmailSendException(String message, Throwable cause) {
            super(message, cause);
        }
        public EmailSendException(String message) {
            super(message);
        }
    }
}
