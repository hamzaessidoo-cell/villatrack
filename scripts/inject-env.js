const fs = require('fs');
const esc = value => JSON.stringify(value || '');
const output = `// Generated at deploy time. Do not commit real keys.\nwindow.__VILLATRACK_ENV__ = { SUPABASE_URL: ${esc(process.env.SUPABASE_URL)}, SUPABASE_ANON_KEY: ${esc(process.env.SUPABASE_ANON_KEY)} };\n`;
fs.writeFileSync('env.js', output);
console.log(`VillaTrack build ready (${process.env.SUPABASE_URL ? 'Supabase configured' : 'demo mode'})`);
