import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { defineConfig } from 'vite';

async function filesWithin(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const paths = await Promise.all(entries.map(async entry => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesWithin(path) : [path];
  }));
  return paths.flat();
}

export default defineConfig({
  plugins: [{
    name: 'version-service-worker-cache',
    async closeBundle() {
      const output = join(process.cwd(), 'dist');
      const files = (await filesWithin(output)).filter(path => !path.endsWith('/sw.js')).sort();
      const hash = createHash('sha256');
      for (const path of files) {
        hash.update(relative(output, path));
        hash.update(await readFile(path));
      }
      const serviceWorker = join(output, 'sw.js');
      const source = await readFile(serviceWorker, 'utf8');
      await writeFile(serviceWorker, source.replace('__CACHE_VERSION__', hash.digest('hex').slice(0, 12)));
    }
  }]
});
