// dark-mode.js
// Gestion du mode sombre / clair avec persistance et synchro

// 1) JS actif : retirer l’indicateur "no-js"
document.documentElement.classList.remove('no-js');

// 2) Constantes
const STORAGE_KEY = 'theme'; // valeur: "light" | "dark"
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// 3) Trouver le bouton (on essaie plusieurs sélecteurs possibles)
function getToggleButton() {
  return (
    document.querySelector('[data-theme-toggle]') ||
    document.querySelector('.mode-toggle button') ||
    document.querySelector('#theme-toggle') ||
    document.querySelector('.toggle-button') ||
    document.querySelector('button[aria-pressed][data-toggle="theme"]')
  );
}

// 4) Thème préféré (stocké > système > défaut: light)
function getPreferredTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') return saved;
  return mediaQuery.matches ? 'dark' : 'light';
}

// 5) Appliquer le thème et tenir l’UI à jour
function applyTheme(theme, { persist = true } = {}) {
  const t = theme === 'dark' ? 'dark' : 'light';

  // Appliquer au <html> (documentElement)
  document.documentElement.setAttribute('data-theme', t);

  // Optionnel : classe sur <body> si votre CSS la regarde
  document.body.classList.toggle('dark', t === 'dark');
  document.body.classList.toggle('light', t === 'light');

  // Mettre à jour le bouton si présent
  const btn = getToggleButton();
  if (btn) {
    // aria-pressed = true si sombre
    btn.setAttribute('aria-pressed', String(t === 'dark'));
    // Mettre à jour le texte si un span.toggle-text existe
    const txt = btn.querySelector('.toggle-text');
    if (txt) txt.textContent = t === 'dark' ? 'Mode sombre' : 'Mode clair';
  }

  if (persist) localStorage.setItem(STORAGE_KEY, t);
  return t;
}

// 6) Initialisation
let currentTheme = applyTheme(getPreferredTheme());

// Si l’utilisateur n’a PAS forcé un choix, suivre le système
function shouldFollowSystem() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved !== 'dark' && saved !== 'light';
}

// Réagir aux changements du système uniquement si on suit le système
mediaQuery.addEventListener?.('change', (e) => {
  if (shouldFollowSystem()) {
    currentTheme = applyTheme(e.matches ? 'dark' : 'light', { persist: false });
  }
});

// 7) Câbler le bouton
const btn = getToggleButton();
if (btn) {
  // Assurer des attributs d’accessibilité
  if (!btn.hasAttribute('aria-pressed')) btn.setAttribute('aria-pressed', String(currentTheme === 'dark'));
  btn.setAttribute('data-toggle', 'theme');

  btn.addEventListener('click', () => {
    currentTheme = applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// 8) Synchroniser entre onglets
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY && e.newValue) {
    currentTheme = applyTheme(e.newValue, { persist: false });
  }
});p
