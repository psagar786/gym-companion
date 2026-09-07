// V5 deployment configuration endpoint; environment values are injected at build/runtime.
module.exports = (req, res) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env;
  const demoMode = process.env.DEMO_MODE === 'true';
  // A public demo can run without cloud credentials. Real sign-in remains disabled
  // until the Supabase values are supplied to the deployment.
  if ((!SUPABASE_URL || !SUPABASE_ANON_KEY) && !demoMode) {
    return res.status(503).json({ error: 'Gym Companion is not configured yet.' });
  }
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=300');
  return res.status(200).json({
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_ANON_KEY,
    appMode: process.env.APP_MODE === 'admin' ? 'admin' : 'member',
    demoMode,
    memberAppUrl: process.env.MEMBER_APP_URL || '',
    adminAppUrl: process.env.ADMIN_APP_URL || ''
  });
};
