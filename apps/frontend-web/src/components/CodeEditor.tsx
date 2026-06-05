import Editor from '@monaco-editor/react';
import { useTheme } from '@/lib/useTheme';

type Language = 'PHP' | 'JS';

const MONACO_LANGS: Record<Language, string> = {
  PHP: 'php',
  JS: 'javascript',
};

type Props = {
  language: Language;
  value: string;
  onChange: (value: string) => void;
  height?: string;
  readOnly?: boolean;
};

/**
 * Editeur de code Monaco (le meme que VS Code), light/dark sync sur le theme.
 */
export function CodeEditor({
  language,
  value,
  onChange,
  height = '320px',
  readOnly = false,
}: Props) {
  const { theme } = useTheme();
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <Editor
        height={height}
        language={MONACO_LANGS[language]}
        value={value}
        onChange={(v: string | undefined) => onChange(v ?? '')}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily:
            "'JetBrains Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace",
          readOnly,
          scrollBeyondLastLine: false,
          tabSize: 2,
          wordWrap: 'on',
          renderLineHighlight: 'gutter',
          automaticLayout: true,
        }}
      />
    </div>
  );
}
