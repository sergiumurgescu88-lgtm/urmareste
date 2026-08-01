import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { CATEGORII } from '../src/data/categories.js';
import { SECTOARE } from '../src/data/sectors.js';

const distDir = join(process.cwd(), 'dist');
const htmlTemplate = readFileSync(join(distDir, 'index.html'), 'utf-8');

async function prerender() {
  const preloadedState = {};

  for (const cat of CATEGORII) {
    for (const sec of SECTOARE) {
      const routePath = `${cat.slug}/${sec.slug}`;
      console.log(`Pre-rendering: /${routePath}`);

      try {
        // Fetch datele direct de la backend-ul local
        const res = await fetch(`http://localhost:4000/api/business?category=${cat.slug}&sector=${sec.slug}`);
        const data = await res.json();
        preloadedState[routePath] = data;

        const title = `${cat.nume} în ${sec.nume} | urmărește.online`;
        const description = `Găsește ${cat.nume.toLowerCase()} verificați în ${sec.nume}. Servicii profesionale, autorizate, cu recenzii reale.`;
        
        // Clonează template-ul HTML
        let html = htmlTemplate;

        // Injectează SEO meta tags
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/<meta name="description".*?>/, `<meta name="description" content="${description}">`);
        
        // Dacă nu există meta description, adaugă-l în head
        if (!html.includes('meta name="description"')) {
          html = html.replace('</head>', `  <meta name="description" content="${description}">\n</head>`);
        }

        // Injectează starea pre-încărcată
        const stateScript = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify({ [routePath]: data })};</script>`;
        html = html.replace('</head>', `  ${stateScript}\n</head>`);

        // Creează folderul și scrie fișierul
        const targetDir = join(distDir, cat.slug, sec.slug);
        if (!existsSync(targetDir)) mkdirSync(targetDir, { recursive: true });
        writeFileSync(join(targetDir, 'index.html'), html);

      } catch (err) {
        console.error(`Eroare la pre-rendering /${routePath}:`, err.message);
      }
    }
  }
  console.log('✅ Pre-rendering complet!');
}

prerender();
