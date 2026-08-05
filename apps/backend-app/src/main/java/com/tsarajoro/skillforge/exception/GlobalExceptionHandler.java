package com.tsarajoro.skillforge.exception;

import com.tsarajoro.skillforge.cv.CvParseException;
import com.tsarajoro.skillforge.cv.UnsupportedCvFormatException;
import com.tsarajoro.skillforge.llm.LlmCallException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<Map<String, Object>> handleEmailAlreadyUsed(EmailAlreadyUsedException e) {
        return error(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<Map<String, Object>> handleAuth(AuthenticationFailedException e) {
        return error(HttpStatus.UNAUTHORIZED, e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException e) {
        String details = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getField() + ": " + f.getDefaultMessage())
                .collect(Collectors.joining("; "));
        return error(HttpStatus.BAD_REQUEST, details);
    }

    @ExceptionHandler(UnsupportedCvFormatException.class)
    public ResponseEntity<Map<String, Object>> handleUnsupportedFormat(UnsupportedCvFormatException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(CvParseException.class)
    public ResponseEntity<Map<String, Object>> handleCvParse(CvParseException e) {
        return error(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(LlmCallException.class)
    public ResponseEntity<Map<String, Object>> handleLlmCall(LlmCallException e) {
        return error(HttpStatus.BAD_GATEWAY, e.getMessage());
    }

    // Entite absente (findById().orElseThrow(), getReferenceById() sur id inexistant) -> 404 propre.
    @ExceptionHandler({ EntityNotFoundException.class, NoSuchElementException.class,
                         NoHandlerFoundException.class, NoResourceFoundException.class })
    public ResponseEntity<Map<String, Object>> handleNotFound(Exception e) {
        return error(HttpStatus.NOT_FOUND, "Ressource introuvable");
    }

    // Path variable ou query param mal type (ex: UUID = "id" -> MethodArgumentTypeMismatchException),
    // corps JSON invalide, parametre manquant, multipart absent -> 400 propre au lieu de 500.
    @ExceptionHandler({ MethodArgumentTypeMismatchException.class,
                         HttpMessageNotReadableException.class,
                         MissingServletRequestParameterException.class,
                         MissingServletRequestPartException.class,
                         MultipartException.class,
                         HandlerMethodValidationException.class,
                         IllegalArgumentException.class })
    public ResponseEntity<Map<String, Object>> handleBadRequest(Exception e) {
        return error(HttpStatus.BAD_REQUEST, "Requete invalide");
    }

    // Methode HTTP non supportee (GET sur endpoint POST) -> 405 propre.
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMethodNotAllowed(HttpRequestMethodNotSupportedException e) {
        return error(HttpStatus.METHOD_NOT_ALLOWED, "Methode non autorisee");
    }

    // Content-Type non supporte (POST /cv/upload sans multipart, JSON attendu texte, ...)
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<Map<String, Object>> handleMediaType(HttpMediaTypeNotSupportedException e) {
        return error(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Type de contenu non supporte");
    }

    // Fallback : toute exception non geree renvoie un 500 generique sans divulguer
    // la stacktrace (Information Disclosure OWASP A05 - Security Misconfiguration).
    // La stacktrace est loguee cote serveur uniquement.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleUnhandled(Exception e) {
        log.error("Unhandled exception", e);
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur interne");
    }

    private ResponseEntity<Map<String, Object>> error(HttpStatus status, String message) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", OffsetDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
