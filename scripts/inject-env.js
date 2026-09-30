const fs = require('fs');
const esc = value => JSON.stringify(value || '');
const supabaseUrl = process.env.SUPABASE_URL || 'https://iqzrrxvraremzzxdysxb.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_dAgWQCdyrhE0i5Nn5wtOig_yhDx8u-6';
const output = `// Generated at deploy time. Do not place service_role keys here.\nwindow.__VILLATRACK_ENV__ = { SUPABASE_URL: ${esc(supabaseUrl)}, SUPABASE_ANON_KEY: ${esc(supabaseKey)} };\n`;
fs.writeFileSync('env.js', output);
console.log(`VillaTrack build ready (${supabaseUrl ? 'Supabase configured' : 'demo mode'})`);
