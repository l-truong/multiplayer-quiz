import { createI18n } from 'vue-i18n';

// Import the translations
import eng from './locales/eng.json';
import fr from './locales/fr.json';

const messages = {
  eng,  // English
  fr,  // French
};

// Create an instance of Vue I18n
const i18n = createI18n({
  locale: 'fr',         // Default language
  fallbackLocale: 'fr', // Fallback language
  messages             // Load translations
});

export default i18n;