/** Reference codes connus du LLM (synchronise avec les prompts backend). */
export type SkillRefItem = {
  code: string;
  displayName: string;
  category: 'Langage' | 'Framework' | 'CMS' | 'Base de donnees' | 'SEO / Perf' | 'Outils';
};

export const SKILL_REFERENTIAL: SkillRefItem[] = [
  { code: 'LANG_PHP', displayName: 'PHP', category: 'Langage' },
  { code: 'LANG_JS', displayName: 'JavaScript', category: 'Langage' },
  { code: 'LANG_TS', displayName: 'TypeScript', category: 'Langage' },
  { code: 'LANG_HTML', displayName: 'HTML', category: 'Langage' },
  { code: 'LANG_CSS', displayName: 'CSS', category: 'Langage' },
  { code: 'LANG_SQL', displayName: 'SQL', category: 'Langage' },

  { code: 'FW_LARAVEL', displayName: 'Laravel', category: 'Framework' },
  { code: 'FW_SYMFONY', displayName: 'Symfony', category: 'Framework' },
  { code: 'FW_VUE', displayName: 'Vue.js', category: 'Framework' },
  { code: 'FW_NUXT', displayName: 'Nuxt', category: 'Framework' },
  { code: 'FW_REACT', displayName: 'React', category: 'Framework' },
  { code: 'FW_TAILWIND', displayName: 'Tailwind CSS', category: 'Framework' },

  { code: 'CMS_WP', displayName: 'WordPress', category: 'CMS' },
  { code: 'CMS_WP_HOOKS', displayName: 'WordPress Hooks', category: 'CMS' },
  { code: 'CMS_WP_THEME', displayName: 'WordPress Themes', category: 'CMS' },
  { code: 'CMS_WP_PLUGIN', displayName: 'WordPress Plugins', category: 'CMS' },

  { code: 'DB_MYSQL', displayName: 'MySQL', category: 'Base de donnees' },
  { code: 'DB_MARIADB', displayName: 'MariaDB', category: 'Base de donnees' },
  { code: 'DB_POSTGRES', displayName: 'PostgreSQL', category: 'Base de donnees' },

  { code: 'SEO_ONPAGE', displayName: 'SEO On-Page', category: 'SEO / Perf' },
  { code: 'SEO_TECHNIQUE', displayName: 'SEO Technique', category: 'SEO / Perf' },
  { code: 'SEO_NETLINKING', displayName: 'Netlinking', category: 'SEO / Perf' },
  { code: 'SEO_SCHEMA', displayName: 'Schema.org', category: 'SEO / Perf' },
  { code: 'PERF_WEB', displayName: 'Performance Web', category: 'SEO / Perf' },

  { code: 'TOOL_GIT', displayName: 'Git', category: 'Outils' },
  { code: 'TOOL_DOCKER', displayName: 'Docker', category: 'Outils' },
  { code: 'TOOL_COMPOSER', displayName: 'Composer', category: 'Outils' },
  { code: 'TOOL_NPM', displayName: 'npm', category: 'Outils' },
];

/** Normalise pour comparaison fuzzy : minuscules, sans accents, sans tirets. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function searchReferential(query: string, excludeCodes: string[] = []): SkillRefItem[] {
  if (!query.trim()) {
    return SKILL_REFERENTIAL.filter((s) => !excludeCodes.includes(s.code));
  }
  const q = normalize(query);
  return SKILL_REFERENTIAL.filter((s) => {
    if (excludeCodes.includes(s.code)) return false;
    return (
      normalize(s.displayName).includes(q) ||
      normalize(s.code).includes(q)
    );
  });
}

/** Code custom genere pour une comp ajoutee manuellement (preserve l'unicite). */
export function makeCustomCode(displayName: string): string {
  const slug = normalize(displayName).toUpperCase().slice(0, 32);
  return `CUSTOM_${slug || 'SKILL'}`;
}
