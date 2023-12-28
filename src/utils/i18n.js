import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from 'languages/en'
import vi from 'languages/vi'

i18n
    .use(initReactI18next)
    .init({
        fallbackLng: JSON.parse(localStorage.getItem('language')) ?? 'en',
        lng: JSON.parse(localStorage.getItem('language')) ?? 'en',
        resources: {
            en: en,
            vi: vi,
        },
    });


export default i18n;