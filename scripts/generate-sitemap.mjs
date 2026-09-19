#!/usr/bin/env node
// Generates dist/sitemap.xml at build time so <lastmod> always reflects the
// actual deploy date without manual edits.
//
// The app is a single-page tool with no router, so the crawlable URL set is
// exactly one page. If real routes are ever added, append them to `routes`.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE = 'https://browser-scope.vercel.app';
const today = new Date().toISOString().slice(0, 10);

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
];

const body = routes
  .map(
    (r) =>
      `  <url>\n    <loc>${SITE}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

writeFileSync(resolve('dist', 'sitemap.xml'), xml);
console.log(`sitemap.xml generated (${routes.length} url, lastmod ${today})`);
