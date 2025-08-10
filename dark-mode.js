// dark-mode.js

// 1) Retirer l'indicateur "no-js" si présent
document.documentElement.classList.remove('no-js');

// 2) Clés & helpers
const STORAGE_KEY = 'theme';

const getPreferredTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme) => {
  // Pour couvrir tous les cas de CSS : attribut + classes
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('dark', theme === 'dark');
  document.body.classList.toggle('light', theme !== 'dark');
};

// 3) Appliquer le thème au chargement
applyTheme(getPreferredTheme());

// 4) Bouton de bascule (on accepte plusieurs sélecteurs possibles)
const toggleBtn =
  document.querySelector('[data-toggle-theme]') ||
  document.querySelector('.js-toggle-theme') ||
  document.querySelector('.mode-toggle button') ||
  document.querySelector('.toggle-button');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    const next = (document.body.classList.contains('dark')) ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  });
}

// 5) Si l’utilisateur change son préférence système, on suit SAUF si l’utilisateur a déjà choisi
const mql = window.matchMedia('(prefers-color-scheme: dark)');
mql.addEventListener?.('change', () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    applyTheme(getPreferredTheme());
  }
});
