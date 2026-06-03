package com.tsarajoro.skillforge.llm;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class MockLlmClientTest {

    private final MockLlmClient client = new MockLlmClient();

    @Test
    void detectsPhpAndLaravel() {
        String cv = "Developpeur PHP / Laravel avec 5 ans d'experience, base MySQL, Git, Docker.";
        CvExtractionResult result = client.extractSkillsFromCv(cv, "DEV_PHP");

        assertThat(result.llmProvider()).isEqualTo("mock");
        assertThat(client.providerName()).isEqualTo("mock");
        assertThat(result.skills())
                .extracting(CvExtractionResult.ExtractedSkill::skillCode)
                .contains("LANG_PHP", "FW_LARAVEL", "DB_MYSQL", "TOOL_GIT", "TOOL_DOCKER");
    }

    @Test
    void detectsWordPressAndSeo() {
        String cv = "Integrateur WordPress confirme, theme et plugin, SEO on-page, netlinking.";
        CvExtractionResult result = client.extractSkillsFromCv(cv, "INT_WORDPRESS");

        assertThat(result.skills())
                .extracting(CvExtractionResult.ExtractedSkill::skillCode)
                .contains("CMS_WP", "SEO_ONPAGE", "SEO_NETLINKING");
    }

    @Test
    void returnsZeroCostForMock() {
        CvExtractionResult result = client.extractSkillsFromCv("anything", "DEV_PHP");
        assertThat(result.tokensUsed()).isZero();
        assertThat(result.costEur().doubleValue()).isZero();
    }
}
