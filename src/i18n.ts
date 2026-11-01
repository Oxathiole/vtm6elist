import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';

import { safeStorage } from './utils/storage';

const storedLang = safeStorage.get('vtm6e-lang') || 'ru';

i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
  },
  lng: storedLang,
  fallbackLng: 'ru',
  interpolation: { escapeValue: false },
});

export const t = i18n.t.bind(i18n);

export async function loadAndChangeLanguage(lng: string) {
  if (lng !== 'ru' && !i18n.hasResourceBundle(lng, 'translation')) {
    const module = await import(`./locales/${lng}.json`);
    i18n.addResourceBundle(lng, 'translation', module.default);
  }
  await i18n.changeLanguage(lng);
}

export default i18n;
