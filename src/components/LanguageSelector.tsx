import React from 'react';
import { useLocale } from '../context/LocaleContext';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { Languages } from 'lucide-react';

export const LanguageSelector: React.FC<{ disabled?: boolean }> = ({ disabled }) => {
  const { locale, setLocale } = useLocale();

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 hover:border-gray-500 transition-colors">
        <Languages size={16} className="text-gray-400" />
        <select 
          value={locale}
          onChange={(e) => setLocale(e.target.value as any)}
          className="bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer appearance-none pr-4 disabled:opacity-50"
          disabled={disabled}
          aria-label="Select language"
        >
          {SUPPORTED_LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code} className="bg-gray-900 text-gray-100">
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};