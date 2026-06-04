package com.tsarajoro.skillforge.llm;

import com.tsarajoro.skillforge.domain.QuestionType;

import java.util.List;

/**
 * Parametres d'une demande de generation de questions au LLM.
 *
 * @param profileCode profil cible (DEV_PHP, INT_WORDPRESS, DEV_VUE, SEO_TECH...)
 * @param skillCodes competences a evaluer (issues de l'analyse du CV ou choisies manuellement)
 * @param types repartition des types de questions a generer
 * @param difficulty niveau de difficulte cible (1 a 5)
 */
public record GenerationRequest(
        String profileCode,
        List<String> skillCodes,
        List<TypeQuota> types,
        int difficulty) {

    /**
     * @param type type de question
     * @param count nombre de questions a generer de ce type
     */
    public record TypeQuota(QuestionType type, int count) {}
}
