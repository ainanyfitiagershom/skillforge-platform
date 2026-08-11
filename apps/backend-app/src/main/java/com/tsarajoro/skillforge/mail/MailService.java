package com.tsarajoro.skillforge.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

/**
 * Envoi transactionnel des mails candidats (invitation).
 *
 * <p>Configuration :
 *   spring.mail.host / port / username / password (variables env SMTP_*),
 *   skillforge.mail.enabled / from / from-name / frontend-base-url.
 *
 * <p>En dev, un container Mailpit du stack Linkuma capture les mails
 * (UI http://mail.linkuma.local). En prod, override par variables env
 * pour cibler un SMTP reel.
 */
@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final JavaMailSender mailSender;

    @Value("${skillforge.mail.enabled:true}")
    private boolean enabled;

    @Value("${skillforge.mail.from:no-reply@skillforge.local}")
    private String from;

    @Value("${skillforge.mail.from-name:SkillForge}")
    private String fromName;

    @Value("${skillforge.mail.frontend-base-url:http://localhost:5173}")
    private String frontendBaseUrl;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Envoie l invitation au candidat, avec code d acces a 6 chiffres integre au mail.
     *
     * @return true si le mail est parti, false sinon (echec silencieux : la creation
     *         d invitation reste valide, le recruteur peut toujours copier le lien).
     */
    public boolean sendInvitationLink(String candidateEmail, String candidateName,
                                       String token, String accessCode,
                                       String profileLabel, int ttlHours) {
        if (!enabled) {
            log.info("Mail desactive (skillforge.mail.enabled=false), skip envoi a {}", candidateEmail);
            return false;
        }
        if (candidateEmail == null || candidateEmail.isBlank()) {
            log.warn("Pas d email candidat, skip envoi invitation");
            return false;
        }
        try {
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, false, StandardCharsets.UTF_8.name());
            helper.setFrom(new InternetAddress(from, fromName, StandardCharsets.UTF_8.name()));
            helper.setTo(candidateEmail);
            helper.setSubject(subject(profileLabel));
            helper.setText(htmlBody(candidateName, token, accessCode, profileLabel, ttlHours), true);
            mailSender.send(msg);
            // Ne PAS logguer le token complet : quiconque a acces aux logs pourrait
            // reconstruire le lien candidat (fix C2 code review). On loggue juste
            // les 8 premiers caracteres pour la tracabilite.
            String tokenPrefix = token == null ? "?" : token.substring(0, Math.min(8, token.length())) + "...";
            log.info("Mail invitation envoye a {} (token {})", candidateEmail, tokenPrefix);
            return true;
        } catch (MessagingException | MailException | UnsupportedEncodingException e) {
            // Echec SMTP : on ne veut pas casser la creation d invitation.
            // Le recruteur pourra toujours copier le lien manuellement.
            log.warn("Echec envoi mail invitation a {} : {}", candidateEmail, e.getMessage());
            return false;
        }
    }

    private String subject(String profileLabel) {
        String suffix = profileLabel == null || profileLabel.isBlank() ? "" : " — " + profileLabel;
        return "Votre test technique SkillForge" + suffix;
    }

    private String htmlBody(String name, String token, String accessCode,
                             String profileLabel, int ttlHours) {
        String greeting = name == null || name.isBlank() ? "Bonjour," : "Bonjour " + escape(name) + ",";
        String link = frontendBaseUrl + "/candidate/passation/" + token;
        String profileBadge = profileLabel == null || profileLabel.isBlank()
                ? ""
                : "<span style=\"display:inline-block;padding:5px 12px;background:#e0f2fe;color:#0284c7;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;border-radius:999px;margin-top:6px;\">"
                    + escape(profileLabel) + "</span>";
        String safeCode = accessCode == null ? "" : escape(accessCode);
        // Séparer chaque chiffre pour affichage visuel type "OTP boxes"
        StringBuilder codeBoxes = new StringBuilder();
        for (int i = 0; i < safeCode.length(); i++) {
            codeBoxes.append("<td align=\"center\" style=\"width:44px;height:56px;background:#ffffff;")
                    .append("border:1.5px solid #bae6fd;border-radius:10px;font-family:'JetBrains Mono',")
                    .append("'SF Mono',Menlo,Monaco,Consolas,monospace;font-size:26px;font-weight:700;")
                    .append("color:#0a1628;padding:0;\">")
                    .append(safeCode.charAt(i))
                    .append("</td>");
            if (i < safeCode.length() - 1) {
                codeBoxes.append("<td style=\"width:6px;padding:0;\"></td>");
            }
        }
        return """
            <!doctype html>
            <html lang="fr"><head><meta charset="utf-8"><title>SkillForge — Votre test technique</title></head>
            <body style="margin:0;padding:40px 16px;font-family:'Inter Tight','Inter','SF Pro Text',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:linear-gradient(180deg,#f5f7fa 0%%,#eef2f7 40%%,#e4ebf4 100%%);color:#0a1628;-webkit-font-smoothing:antialiased;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="max-width:720px;margin:0 auto;">
                <!-- Header brand -->
                <tr><td style="padding:0 8px 24px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:0 12px 0 0;">
                        <div style="width:44px;height:44px;background:linear-gradient(135deg,#0284c7 0%%,#0ea5e9 50%%,#38bdf8 100%%);border-radius:12px;text-align:center;line-height:44px;font-weight:700;color:#ffffff;font-size:22px;letter-spacing:-0.02em;box-shadow:0 4px 12px rgba(14,165,233,0.35);">S</div>
                      </td>
                      <td valign="middle" style="padding:0;">
                        <div style="font-size:22px;font-weight:700;letter-spacing:-0.03em;color:#0a1628;line-height:1;">SkillForge</div>
                        <div style="font-size:11px;font-weight:500;color:#64748b;margin-top:3px;letter-spacing:0.02em;">Plateforme d'évaluation technique</div>
                      </td>
                    </tr>
                  </table>
                </td></tr>

                <!-- Main card -->
                <tr><td style="background:#ffffff;border-radius:24px;padding:0;box-shadow:0 24px 48px -12px rgba(10,22,40,0.12),0 2px 8px rgba(10,22,40,0.04);overflow:hidden;">

                  <!-- Hero band gradient blanc -> bleu clair, texte sombre lisible -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="border-collapse:collapse;">
                    <tr><td style="background:linear-gradient(135deg,#ffffff 0%%,#f0f9ff 55%%,#e0f2fe 100%%);padding:40px 48px;color:#0a1628;border-bottom:1px solid #e4ebf4;">
                      <div style="font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#0284c7;margin-bottom:14px;">Nouvelle invitation</div>
                      <div style="font-size:28px;font-weight:700;letter-spacing:-0.03em;line-height:1.2;color:#0a1628;">Votre test technique vous attend</div>
                      %s
                    </td></tr>
                  </table>

                  <!-- Body -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="border-collapse:collapse;">
                    <tr><td style="padding:36px 48px 8px;">
                      <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0a1628;letter-spacing:-0.01em;">%s</p>
                      <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#334155;">
                        Vous avez été invité à passer un test technique sur SkillForge. Il évalue vos compétences via des QCM, des exercices de code exécutés en sandbox sécurisée, et des cas pratiques.
                      </p>
                    </td></tr>
                  </table>

                  <!-- Access code block — style OTP boxes -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="border-collapse:collapse;">
                    <tr><td style="padding:0 48px 4px;">
                      <div style="padding:24px;background:linear-gradient(135deg,#f0f9ff 0%%,#e0f2fe 100%%);border-radius:16px;border:1px solid #bae6fd;text-align:center;">
                        <div style="font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#0369a1;margin-bottom:14px;">Votre code d'accès personnel</div>
                        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="border-collapse:separate;margin:0 auto;">
                          <tr>%s</tr>
                        </table>
                        <div style="font-size:12px;color:#64748b;margin-top:14px;line-height:1.4;">
                          À saisir sur la page de démarrage · Valable %d heures
                        </div>
                      </div>
                    </td></tr>
                  </table>

                  <!-- CTA button -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="border-collapse:collapse;">
                    <tr><td align="center" style="padding:32px 48px 8px;">
                      <a href="%s" style="display:inline-block;padding:16px 44px;background:linear-gradient(135deg,#0284c7 0%%,#0ea5e9 100%%);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;letter-spacing:-0.01em;border-radius:14px;box-shadow:0 8px 24px -8px rgba(14,165,233,0.5);">
                        Démarrer mon test →
                      </a>
                    </td></tr>
                  </table>

                  <!-- Backup link -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="border-collapse:collapse;">
                    <tr><td style="padding:20px 48px 32px;">
                      <div style="padding:14px 16px;background:#f5f7fa;border-radius:10px;border:1px solid #e4ebf4;">
                        <div style="font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#94a3b8;margin-bottom:6px;">Lien de secours</div>
                        <div style="font-size:11px;color:#475569;word-break:break-all;font-family:'JetBrains Mono','SF Mono',Menlo,monospace;line-height:1.5;">%s</div>
                      </div>
                    </td></tr>
                  </table>

                  <!-- Info tips -->
                  <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="border-collapse:collapse;">
                    <tr><td style="padding:0 48px 28px;">
                      <div style="border-top:1px solid #e4ebf4;padding-top:20px;">
                        <div style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#64748b;margin-bottom:12px;">Bon à savoir</div>
                        <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="border-collapse:collapse;">
                          <tr>
                            <td valign="top" style="padding:0 8px 8px 0;width:24px;font-size:13px;">🔒</td>
                            <td valign="top" style="padding:0 0 8px;font-size:13px;color:#475569;line-height:1.5;">Le code d'accès et le lien sont <strong>personnels</strong>. Ne les partagez avec personne.</td>
                          </tr>
                          <tr>
                            <td valign="top" style="padding:0 8px 8px 0;width:24px;font-size:13px;">⏱️</td>
                            <td valign="top" style="padding:0 0 8px;font-size:13px;color:#475569;line-height:1.5;">Vous pouvez interrompre et reprendre le test — vos réponses sont sauvegardées.</td>
                          </tr>
                          <tr>
                            <td valign="top" style="padding:0 8px 0 0;width:24px;font-size:13px;">🛡️</td>
                            <td valign="top" style="padding:0;font-size:13px;color:#475569;line-height:1.5;">Une analyse anti-fraude vous sera présentée avant le démarrage. Elle est consentie.</td>
                          </tr>
                        </table>
                      </div>
                    </td></tr>
                  </table>

                </td></tr>

                <!-- Footer -->
                <tr><td style="padding:24px 8px 0;text-align:center;">
                  <div style="font-size:11px;color:#94a3b8;line-height:1.6;">
                    Cet email vous a été envoyé automatiquement par SkillForge.<br/>
                    Si vous n'avez pas sollicité ce test, ignorez simplement ce message.
                  </div>
                  <div style="margin-top:16px;font-size:11px;color:#cbd5e1;letter-spacing:0.05em;">
                    © %d Tsarajoro · SkillForge
                  </div>
                </td></tr>

              </table>
            </body></html>
            """.formatted(
                    profileBadge,
                    greeting,
                    codeBoxes.toString(),
                    ttlHours,
                    link,
                    link,
                    LocalDate.now().getYear());
    }

    private String escape(String s) {
        return s.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
