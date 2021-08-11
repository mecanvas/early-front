const fs = require('fs');
const globby = require('globby');

// const fetchUrl = 'https://api.early21.com/post/all';
const YOUR_URL = 'https://early21.com';
const getDate = new Date().toISOString();

async function generateSiteMap() {
  const pages = await globby([
    '../pages/**/*.tsx',
    '../pages/*.tsx',
    '!../pages/_*.tsx',
    '!../pages/404/*.tsx',
    '!../pages/admin/*.tsx',
  ]);
  console.log(pages);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
     ${pages
       .map((page) => {
         const path = page
           .replace('../pages/', '')
           .replace('.tsx', '')
           .replace(/\/index/g, '');

         const routePath = path === 'index' ? '' : path;
         return `
            <url>
              <loc>${YOUR_URL}/${routePath}</loc>
              <lastmod>${getDate}</lastmod>
            </url>
          `;
       })
       .join('')}

      </urlset>
  `;

  fs.writeFileSync('./public/sitemap.xml', sitemap);
}

generateSiteMap();
