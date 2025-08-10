// dark-mode.js
// ———————————————————————————————————————————
// Gestion du mode sombre / clair
// - Retire l’indicateur "no-js"
// - Applique le thème préféré (localStorage ou système)
// - Persiste le choix de l’utilisateur
// - Met à jour l’UI du bouton (aria-pressed + texte)
// - Se synchronise entre onglets
// ———————————————————————————————————————————

/* 1) JS actif : retirer l'indicateur "no-js" sur <html> */
document.documentElement.classList.remove('no-js');

/* 2) Constantes */
const STORAGE_KEY = 'theme';           // clé de stockage
const THEME_LIGHT = 'light';
const THEME_DARK  = 'dark';

/* 3) Récupérer le thème préféré (stocké > système > défaut clair) */
const getPreferredTheme = () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === THEME_DARK || saved === THEME_LIGHT) {
    return saved;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? THEME_DARK
    : THEME_LIGHT;
};

/* 4) Appliquer le thème dans le DOM + UI */
const applyTheme = (theme, { save = false } = {}) => {
  // Attribut de données (pratique si ton CSS cible [data-theme="dark"])
  document.documentElement.dataset.theme = theme;

  // En plus, on peut offrir une classe .theme-dark (si ton CSS la préfère)
  document.documentElement.classList.toggle('theme-dark', theme === THEME_DARK);

  // (Optionnel) classe sur <body> si tu en as besoin dans ton CSS
  // document.body.classList.toggle('theme-dark', theme === THEME_DARK);

  // Sauvegarde
  if (save) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Mettre à jour l’UI du bouton
  updateToggleUI(theme);
};

/* 5) Brancher le bouton de bascule */
const getToggleButton = () =>
  // Essaie d'abord le markup proposé (<div class="mode-toggle"><button>…</button></div>)
  document.querySelector('.mode-toggle button')
  // alternatives courantes si ton HTML diffère
  || document.querySelector('.js-mode-toggle')
  || document.querySelector('[data-toggle-theme]');

const updateToggleUI = (theme) => {
  const btn = getToggleButton();
  if (!btn) return;

  const isDark = theme === THEME_DARK;
  btn.setAttribute('aria-pressed', String(isDark));

  // Texte lisible dans <span class="toggle-text"> si présent
  const textSpan = btn.querySelector('.toggle-text');
  if (textSpan) {
    textSpan.textContent = isDark ? 'Mode clair' : 'Mode sombre';
  } else {
    // À défaut, on met à jour l’aria-label du bouton
    btn.setAttribute('aria-label', isDark ? 'Basculer en mode clair' : 'Basculer en mode sombre');
  }
};

const toggleTheme = () => {
  const next = (document.documentElement.dataset.theme === THEME_DARK)
    ? THEME_LIGHT
    : THEME_DARK;
  applyTheme(next, { save: true });
};

/* 6) Init au chargement */
const init = () => {
  applyTheme(getPreferredTheme(), { save: false });

  const btn = getToggleButton();
  if (btn) {
    btn.addEventListener('click', toggleTheme);
    // Accessibilité : activer avec Entrée/Espace si besoin
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleTheme();
      }
    });
  

  // Synchronisation entre onglets
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && (e.newValue === THEME_LIGHT || e.newValue === THEME_DARK)) {
      applyTheme(e.newValue, { save: false });
    }
  });

  // Réagir aux changements système si l’utilisateur n’a pas encore choisi
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', (mq) => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== THEME_LIGHT && saved !== THEME_DARK) {
        applyTheme(mq.matches ? THEME_DARK : THEME_LIGHT, { save: false });
      }
    });
  }
};

init();
