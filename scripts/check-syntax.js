const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const roots = ['src', 'scripts'];
const ignored = new Set(['node_modules']);

function collectFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      return ignored.has(entry.name) ? [] : collectFiles(fullPath);
    }

    return entry.isFile() && entry.name.endsWith('.js') ? [fullPath] : [];
  });
}

const files = roots.flatMap(collectFiles);
let failed = false;

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    encoding: 'utf8',
    stdio: 'pipe',
  });

  if (result.status !== 0) {
    failed = true;
    process.stderr.write(result.stderr || result.stdout);
  }
}

if (failed) {
  process.exit(1);
}

console.log(`Checked ${files.length} JavaScript files.`);
