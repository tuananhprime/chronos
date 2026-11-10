import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const source = resolve('src/main/resources/static');
const output = resolve('dist');
mkdirSync(output, { recursive: true });
cpSync(source, output, { recursive: true });
writeFileSync(join(output, 'preview.css'), '.guest-notice{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;padding:16px 20px;margin-bottom:24px;border:1px solid #2489a8;border-radius:12px;background:#082632;color:#d5eef8;font:14px/1.5 system-ui,sans-serif}.guest-notice a{color:#5edaff;font-weight:600}main button:disabled{opacity:.5;cursor:not-allowed}main input:disabled,main select:disabled,main textarea:disabled{opacity:.65}');
writeFileSync(join(output, 'preview-config.js'), 'window.CHRONOS_PREVIEW_ONLY = true;\n');
for (const file of readdirSync(output).filter(name => name.endsWith('.html'))) {
  const target = join(output, file);
  const html = readFileSync(target, 'utf8');
  writeFileSync(target, html.replace('<head>', '<head>\n    <script src="/preview-config.js"></script>\n    <link rel="stylesheet" href="/preview.css">'));
}
writeFileSync(join(output, 'index.html'), '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/dashboard.html"><title>CHRONOS</title></head><body><a href="/dashboard.html">Xem giao diện CHRONOS</a></body></html>');
console.log('CHRONOS guest-only preview generated in dist/');
