import {writeFile} from 'node:fs/promises';
import {projects} from '../src/data/projects.js';
import {posts} from '../src/data/posts.js';
const origin='https://adityaanugrah.me';
const categories={'web':'Web Apps','mobile':'Mobile Apps','landing':'Landing Pages'};
const paths=['','/about','/projects','/blog','/contact','/cv','/store','/privacy','/terms','/invoice',...Object.entries(categories).filter(([,category])=>projects.some(project=>project.category===category)).map(([slug])=>'/projects/'+slug),...projects.map(project=>'/projects/item/'+encodeURIComponent(project.id)),...posts.map(post=>'/blog/'+encodeURIComponent(post.id))];
const xml=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const entries=[...new Set(paths)].flatMap(path=>['id','en'].map(locale=>{
 const alternatives=['id','en','x-default'].map(lang=>`    <xhtml:link rel="alternate" hreflang="${lang}" href="${xml(origin+'/'+(lang==='x-default'?'en':lang)+path)}" />`).join('\n');
 return `  <url>\n    <loc>${xml(origin+'/'+locale+path)}</loc>\n${alternatives}\n  </url>`;
}));
await writeFile(new URL('../public/sitemap.xml',import.meta.url),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`);
console.log(`SITEMAP: ${entries.length} public localized URLs; no admin/order or empty categories.`);
