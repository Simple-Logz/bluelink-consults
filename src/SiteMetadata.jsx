import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {pageMetadata,profileLinks} from './pageMetadata';
export function SiteMetadata() {
 const {pathname}=useLocation();
 useEffect(()=>{
  const host=location.hostname.endsWith('.ng')?'https://www.bluelinkconsults.ng':'https://www.bluelinkconsults.com';
  const route=pathname.replace(/\/$/,'')||'/';
  const [title,description]=pageMetadata[route]||['BlueLink Consults','Technology assessment, modernization, cloud and dependable delivery.'];
  const url=host+route;
  document.title=`${title} | BlueLink Consults`;
  const meta=(name,value,property=false)=>{const selector=`meta[${property?'property':'name'}="${name}"]`;let e=document.head.querySelector(selector);if(!e){e=document.createElement('meta');e.setAttribute(property?'property':'name',name);document.head.appendChild(e);}e.content=value;};
  let canonical=document.head.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}canonical.href=url;
  meta('description',description);meta('og:title',`${title} | BlueLink Consults`,true);meta('og:description',description,true);meta('og:url',url,true);meta('og:image',host+'/og-image.png',true);meta('og:type',route.includes('cbn-data-localisation')?'article':'website',true);meta('twitter:title',`${title} | BlueLink Consults`);meta('twitter:description',description);meta('twitter:image',host+'/og-image.png');
  meta('robots',/^\/(client-login|simulator|connect|preview)(\/|$)/.test(route)?'noindex,nofollow':'index,follow');
  let schema=document.head.querySelector('script[type="application/ld+json"]');if(schema && !route.includes('cbn-data-localisation')) schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'BlueLink Consults',legalName:host.endsWith('.ng')?'Blue Link Consults Ltd':undefined,url:host,logo:host+'/bluelink-logo.png',sameAs:profileLinks});
 },[pathname]);
 return null;
}
