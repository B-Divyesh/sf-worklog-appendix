import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const grepIndex = args.indexOf('--grep');
if (grepIndex !== -1) {
  const pattern = args[grepIndex + 1];
  if (!pattern) throw new Error('Give --grep a test tag.');
  args.splice(grepIndex, 2);
  const result = spawnSync('npx', ['playwright', 'test', '--grep', pattern], { stdio:'inherit', shell:process.platform === 'win32' });
  process.exit(result.status ?? 1);
}
const result = spawnSync('npx', ['vitest', 'run', ...args], { stdio:'inherit', shell:process.platform === 'win32' });
if ((result.status ?? 1) !== 0) process.exit(result.status ?? 1);
const browser = spawnSync('npx', ['playwright', 'test'], { stdio:'inherit', shell:process.platform === 'win32' });
process.exit(browser.status ?? 1);
