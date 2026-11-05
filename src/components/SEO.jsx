import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { imageUrl } from '../lib/media';
import { portfolioMedia } from '../lib/portfolioMedia';
import { localeToOgLocale, localizedPath, stripLocaleFromPath, useActiveLocale } from '../lib/i18n';
import { SITE_URL, SITE_NAME, canonicalPath, seoTitle, robotsValue } from '../lib/seo';

const absolute=value=>new URL(value||'/',SITE_URL+'/').href;

// Adopt fallback metadata rather than leaving two conflicting copies in the head.
function upsert(selector,tag,attributes,text){
  const matches=[...document.head.querySelectorAll(selector)];
  const node=matches.shift()||document.createElement(tag);
  matches.forEach(extra=>extra.remove());
  for(const [key,value]of Object.entries(attributes))node.setAttribute(key,String(value));
  node.dataset.seo='seo-managed';
  if(text!==undefined)node.textContent=text;
  if(!node.isConnected)document.head.appendChild(node);
  return node;
}
const meta=(key,value,property=false)=>{
  if(value===undefined||value===null)return;
  const attribute=property?'property':'name';
  upsert(`meta[${attribute}="${key}"]`,'meta',{[attribute]:key,content:value});
};
const link=(rel,href,language)=>upsert(`link[rel="${rel}"]${language?`[hreflang="${language}"]`:''}`,'link',{rel,href,...(language?{hreflang:language}:{})});

export default function SEO({title,description,path='',type='website',image='/assets/me-sunset.jpeg',imageAlt,robots='index,follow',jsonLd,siteName=SITE_NAME,titleTemplate,locale,twitter,publishedTime,modifiedTime,articleSection}){
  const activeLocale=useActiveLocale(),location=useLocation();
  const pagePath=canonicalPath(stripLocaleFromPath(path||location.pathname));
  const customGraph=useMemo(()=>jsonLd?(Array.isArray(jsonLd)?jsonLd:[jsonLd]):[],[jsonLd]);
  useEffect(()=>{
    const previousTitle=document.title,previousLang=document.documentElement.lang;
    const fullTitle=seoTitle(title,siteName,titleTemplate);
    const summary=description||(activeLocale==='id'?'Portfolio Aditya Anugrah, full-stack developer untuk website, aplikasi bisnis, dan integrasi sistem.':'Aditya Anugrah’s portfolio: full-stack development for websites, business applications, and system integrations.');
    const canonical=absolute(localizedPath(pagePath,activeLocale));
    const ogImage=absolute(imageUrl(portfolioMedia(image)||'/assets/me-sunset.jpeg'));
    const robotsContent=robotsValue(robots),indexable=!robotsContent.includes('noindex');
    document.title=fullTitle;document.documentElement.lang=activeLocale;
    meta('description',summary);meta('robots',robotsContent);
    meta('twitter:card','summary_large_image');meta('twitter:title',fullTitle);meta('twitter:description',summary);meta('twitter:image',ogImage);meta('twitter:image:alt',imageAlt||title||siteName);
    if(twitter?.site)meta('twitter:site',twitter.site);
    if(twitter?.creator)meta('twitter:creator',twitter.creator);
    link('canonical',canonical);
    if(indexable)for(const lang of ['id','en','x-default'])link('alternate',absolute(localizedPath(pagePath,lang==='x-default'?'en':lang)),lang);
    for(const [key,value]of Object.entries({type,title:fullTitle,description:summary,url:canonical,site_name:siteName,locale:locale||localeToOgLocale(activeLocale),'locale:alternate':activeLocale==='id'?'en_US':'id_ID',image:ogImage,'image:secure_url':ogImage,'image:alt':imageAlt||title||siteName}))meta('og:'+key,value,true);
    if(type==='article'){
      if(publishedTime)meta('article:published_time',publishedTime,true);
      if(modifiedTime)meta('article:modified_time',modifiedTime,true);
      if(articleSection)meta('article:section',articleSection,true);
    }
    const personId=SITE_URL+'/#person',websiteId=SITE_URL+'/#website';
    const graph=[];
    if(indexable){
      if(!customGraph.some(item=>item['@type']==='Person'))graph.push({'@type':'Person','@id':personId,name:siteName,url:absolute(localizedPath('/about',activeLocale)),jobTitle:'Full-stack Developer'});
      graph.push({'@type':type==='article'?'BlogPosting':/^\/(projects|blog)$/.test(pagePath)?'CollectionPage':'WebPage','@id':canonical+'#page',url:canonical,name:fullTitle,description:summary,inLanguage:activeLocale,isPartOf:{'@id':websiteId},author:{'@id':personId},...(type==='article'?{headline:title,image:ogImage,...(publishedTime?{datePublished:publishedTime}:{}),...(modifiedTime?{dateModified:modifiedTime}:{})}:{})});
      const crumbs=[{name:activeLocale==='id'?'Beranda':'Home',item:absolute(localizedPath('/',activeLocale))}];
      if(pagePath.startsWith('/blog/'))crumbs.push({name:activeLocale==='id'?'Tulisan':'Journal',item:absolute(localizedPath('/blog',activeLocale))});
      if(pagePath.startsWith('/projects/'))crumbs.push({name:activeLocale==='id'?'Karya':'Work',item:absolute(localizedPath('/projects',activeLocale))});
      if(pagePath!=='/')crumbs.push({name:seoTitle(title,siteName).replace(' | '+siteName,''),item:canonical});
      if(crumbs.length>1)graph.push({'@type':'BreadcrumbList',itemListElement:crumbs.map((item,index)=>({'@type':'ListItem',position:index+1,...item}))});
      graph.push(...customGraph.map(item=>item['@type']==='Person'?{...item,'@id':personId}:item));
      upsert('script[type="application/ld+json"][data-seo="seo-managed"]','script',{type:'application/ld+json'},JSON.stringify({'@context':'https://schema.org','@graph':graph}));
    }
    return()=>{
      document.title=previousTitle;document.documentElement.lang=previousLang;
      document.head.querySelectorAll('[data-seo="seo-managed"]').forEach(node=>node.remove());
    };
  },[title,description,pagePath,activeLocale,type,image,imageAlt,robots,siteName,titleTemplate,locale,twitter?.site,twitter?.creator,publishedTime,modifiedTime,articleSection,customGraph]);
  return null;
}
