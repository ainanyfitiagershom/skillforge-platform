package com.tsarajoro.skillforge.llm;

/**
 * Abstraction au-dessus d'un fournisseur de modele de langage.
 *
 * Permet de basculer entre OpenAI, Claude (Anthropic) ou un mock de developpement
 * sans changer le code metier. Le choix se fait via la propriete skillforge.llm.provider.
 */
public interface LlmClient {

    /**
     * Extrait les competences d'un CV en texte brut.
     *
     * @param cvText texte du CV
     * @param profileCode code du profil cible (par exemple DEV_PHP, INT_WORDPRESS)
     * @return resultat structure (competences + niveaux + couts API)
     */
    CvExtractionResult extractSkillsFromCv(String cvText, String profileCode);

    /**
     * Nom du fournisseur (openai, claude, mock).
     */
    String providerName();
}
