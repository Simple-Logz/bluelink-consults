import fs from 'node:fs';
import {pageMetadata,profileLinks} from '../src/pageMetadata.js';
const original=fs.readFileSync('dist/index.html','utf8');
// Domain-specific rewrites must take precedence over the legacy root files.
fs.rmSync('dist/sitemap.xml',{force:true});
fs.rmSync('dist/robots.txt',{force:true});
const escape=value=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
for(const [site,host] of [['ng','https://www.bluelinkconsults.ng'],['global','https://www.bluelinkconsults.com']]) {
 fs.mkdirSync(`dist/__pages/${site}`,{recursive:true});
 for(const [path,[title,description]] of Object.entries(pageMetadata)) {
  const url=host+path;let html=original;
  const socialTitle = site==='ng' && path==='/' ? 'BlueLink Consults | Technology Consulting' : title+' | BlueLink Consults';
  const socialDescription = site==='ng' && path==='/' ? 'Modernise applications, strengthen cloud infrastructure and improve software delivery.' : description;
  const socialImage = site==='ng' ? host+'/bluelink-share-v2.jpg' : host+'/og-image.png';
  html=html.replace(/<title>.*?<\/title>/,`<title>${escape(title)} | BlueLink Consults</title>`);
  html=html.replace(/(<meta name="description" content=")[^"]*/,`$1${escape(description)}`);
  html=html.replace(/(<link rel="canonical" href=")[^"]*/,`$1${url}`);
  for(const [name,value] of Object.entries({'og:title':socialTitle,'og:description':socialDescription,'og:url':url,'og:image':socialImage,'og:type':path.includes('cbn-data-localisation')?'article':'website'})) html=html.replace(new RegExp(`(<meta property="${name}" content=")[^"]*`),`$1${escape(value)}`);
  for(const [name,value] of Object.entries({'twitter:title':socialTitle,'twitter:description':socialDescription,'twitter:image':socialImage})) html=html.replace(new RegExp(`(<meta name="${name}" content=")[^"]*`),`$1${escape(value)}`);
  if(site==='ng') html=html.replace('</head>',`<meta property="og:site_name" content="BlueLink Consults" /><meta property="og:image:secure_url" content="${socialImage}" /><meta property="og:image:type" content="image/jpeg" /><meta property="og:image:width" content="1200" /><meta property="og:image:height" content="630" /><meta property="og:image:alt" content="BlueLink Consults logo" /><meta name="twitter:image:alt" content="BlueLink Consults logo" /></head>`);
  const schema={'@context':'https://schema.org','@graph':[{'@type':'Organization',name:'BlueLink Consults',...(site==='ng'?{legalName:'Blue Link Consults Ltd'}:{}),url:host,logo:host+'/bluelink-logo.png',sameAs:profileLinks}]};
  if(path.includes('cbn-data-localisation')) schema['@graph'].push({'@type':'BlogPosting',headline:title,description,datePublished:'2026-10-09',dateModified:'2026-10-09',author:{'@type':'Organization',name:'BlueLink Consults'},publisher:{'@type':'Organization',name:'BlueLink Consults'},mainEntityOfPage:url,image:host+'/images/conference-work.jpg'});
  html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">${JSON.stringify(schema)}</script>`);
  fs.writeFileSync(`dist/__pages/${site}/${path==='/'?'home':path.slice(1).replaceAll('/','--')}.html`,html);
 }
 fs.writeFileSync(`dist/__pages/${site}/sitemap.xml`,`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pageMetadata).filter(p=>!p.startsWith('/insights/cbn-')).map(p=>`<url><loc>${host}${p}</loc></url>`).join('')}</urlset>`);
 fs.writeFileSync(`dist/__pages/${site}/robots.txt`,`User-agent: *\nAllow: /\nDisallow: /client-login\nDisallow: /simulator\nDisallow: /connect\nDisallow: /preview/\nDisallow: /api/\nDisallow: /__pages/\nSitemap: ${host}/sitemap.xml\n`);
}
console.log('Built domain-aware metadata for',Object.keys(pageMetadata).length,'public routes.');
