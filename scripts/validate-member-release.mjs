import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const browserFiles = ['member-app.js', 'bootstrap.js', 'index.html', 'styles.css'];
const forbidden = /SUPABASE_SERVICE_ROLE_KEY|service[_-]?role/i;
const failures = [];

for (const file of browserFiles) {
  const contents = await readFile(join(root, file), 'utf8');
  if (forbidden.test(contents)) failures.push(`${file}: service-role credential reference found in browser-delivered code`);
}

const app = await readFile(join(root, 'member-app.js'), 'utf8');
if (!/RELEASE_VERSION\s*=\s*['"]5\.4['"]/.test(app)) failures.push('member-app.js: V5.4 release marker is missing');
if (!/appMode:\s*['"]member['"]/.test(await readFile(join(root, 'scripts/local-v53-server.mjs'), 'utf8')) && !/appMode/.test(await readFile(join(root, 'api/config.js'), 'utf8'))) {
  failures.push('member runtime: app mode configuration is missing');
}

if (failures.length) {
  console.error(failures.map(item => `FAIL: ${item}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: member release marker V5.4 and browser credential boundary validated (${browserFiles.length} files).`);
}
