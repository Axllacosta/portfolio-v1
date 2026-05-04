import { translations, type Lang } from '../data/translations';

function getNestedValue(obj: any, path: string): string | string[] {
    return path.split('.').reduce((acc, part) => acc?.[part], obj) || '';
}

let currentLang: Lang = 'en';

export function getCurrentLang(): Lang {
    return currentLang;
}

export function initI18n() {
    currentLang = 'en';

    const switchBtn = document.getElementById('language-switch');
    if (!switchBtn) return;

}

// Applies the translations of the specified language to the entire DOM.
export function applyLanguage(lang: Lang) {
    const t = translations[lang];
    currentLang = lang;

    // 1. Translate individual elements [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;

        const translation = getNestedValue(t, key);
        if (translation && typeof translation === 'string') {
            el.textContent = translation;
        }
    });

    // 2. Translate lists [data-i18n-list] with items [data-i18n-item]
    document.querySelectorAll('[data-i18n-list]').forEach((listEl) => {
        const key = listEl.getAttribute('data-i18n-list');
        if (!key) return;

        const items = getNestedValue(t, key);
        if (Array.isArray(items)) {
            const children = listEl.querySelectorAll('[data-i18n-item]');
            children.forEach((child, index) => {
                if (items[index]) {
                    child.textContent = items[index];
                }
            });
        }
    });
}