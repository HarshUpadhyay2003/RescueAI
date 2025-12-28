# RescueAI Internalization (i18n)

This project uses a lightweight, custom i18n implementation to handle multiple languages.

## Adding a Language

1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`).
2. Copy the structure from `en.json`.
3. Translate all values.
4. Import the file in `src/i18n/index.ts`.
5. Add the language code and name to `SUPPORTED_LANGUAGES` in `src/i18n/index.ts`.
6. Add the import to the `RESOURCES` object in `src/i18n/index.ts`.

## Usage in Components

Use the `useLocale` hook:

```tsx
import { useLocale } from '../context/LocaleContext';

const MyComponent = () => {
  const { t } = useLocale();
  return <h1>{t('header.title')}</h1>;
}
```

## AI Content Localization

The AI model returns a `DisasterReport` with a `language` field. 
- `App.tsx` passes the current locale to the `analyzeDisaster` service.
- `AnalysisResult.tsx` attempts to render the localized field from the report. 
- If the report language differs from the UI locale, it falls back to the English version (`_en` fields) or the primary field if available.

## Reviewing Translations

Search for `__LOW_CONF__` in translation files to find auto-generated translations that need human review.
