package com.tsarajoro.skillforge.cv;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Locale;

/**
 * Extrait le texte brut d'un CV au format PDF ou DOCX.
 *
 * Strategie :
 * 1. PDF → Apache PDFBox.
 * 2. DOCX → Apache POI.
 * 3. PDF scanne (presque pas de texte) → fallback OCR Tesseract (tess4j) — a brancher au Sprint 2.
 */
@Service
public class CvParserService {

    private static final Logger log = LoggerFactory.getLogger(CvParserService.class);

    // Si le PDF retourne moins de N caracteres, on considere qu'il est probablement scanne.
    private static final int OCR_FALLBACK_THRESHOLD_CHARS = 100;

    public ParseResult parse(String fileName, byte[] content) {
        String lower = fileName.toLowerCase(Locale.ROOT);
        try {
            if (lower.endsWith(".pdf")) {
                String text = parsePdf(content);
                if (text.length() < OCR_FALLBACK_THRESHOLD_CHARS) {
                    log.warn("PDF '{}' contient {} caracteres : probablement scanne, OCR fallback recommande",
                            fileName, text.length());
                    return new ParseResult(text, "pdf", true);
                }
                return new ParseResult(text, "pdf", false);
            }
            if (lower.endsWith(".docx")) {
                return new ParseResult(parseDocx(content), "docx", false);
            }
            throw new UnsupportedCvFormatException("format non supporte : " + fileName);
        } catch (IOException e) {
            throw new CvParseException("erreur de parsing du CV " + fileName + " : " + e.getMessage(), e);
        }
    }

    private String parsePdf(byte[] content) throws IOException {
        try (PDDocument doc = Loader.loadPDF(content)) {
            return new PDFTextStripper().getText(doc).trim();
        }
    }

    private String parseDocx(byte[] content) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(new java.io.ByteArrayInputStream(content));
             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText().trim();
        }
    }

    /**
     * @param text texte brut extrait
     * @param sourceFormat 'pdf' ou 'docx'
     * @param ocrFallbackRecommended true si on suspecte un PDF scanne
     */
    public record ParseResult(String text, String sourceFormat, boolean ocrFallbackRecommended) {}
}
