(function(){
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('theme-toggle');
    if(btn){
      const isLight = theme === 'light';
      btn.setAttribute('aria-pressed', String(isLight));
      btn.title = isLight ? 'Switch to dark theme' : 'Switch to light theme';
      btn.textContent = isLight ? '☀️' : '🌙';
    }
  }
  function getStoredTheme(){
    try{ return localStorage.getItem('theme') || 'dark'; }catch{ return 'dark'; }
  }
  function storeTheme(theme){
    try{ localStorage.setItem('theme', theme); }catch{}
  }
  function init(){
    const initial = getStoredTheme();
    applyTheme(initial);
    const btn = document.getElementById('theme-toggle');
    if(btn){
      btn.addEventListener('click', function(){
        const next = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
        applyTheme(next);
        storeTheme(next);
      });
    }
  }
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
