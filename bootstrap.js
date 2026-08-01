const app = document.querySelector('#app');

try {
  const response = await fetch('/api/config');
  const config = await response.json();
  if (!response.ok) throw new Error(config.error || 'Configuration unavailable.');
  window.GYM_COMPANION_CONFIG = config;
  await import(config.appMode === 'admin' ? './admin-app.js' : './member-app.js');
} catch (error) {
  app.innerHTML = `<main class="shell auth"><span class="brand"><img src="assets/fitness7-hero-logo.png" alt="Fitness 7"></span><section class="auth-panel"><p class="eyebrow">V3 SETUP</p><h1>Connect the hosted app</h1><p class="notice">${String(error.message || error)}</p><p>This account version runs through its Vercel URL and Supabase. It cannot run by opening the HTML file directly.</p></section></main>`;
}
