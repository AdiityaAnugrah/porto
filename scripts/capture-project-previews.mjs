import {chromium} from 'playwright';
import {mkdir,writeFile,rename,rm,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {projectWebsites} from '../src/data/project-websites.js';

const directory=new URL('../public/assets/projects/live/',import.meta.url);
await mkdir(directory,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
const only=process.argv.find(argument=>argument.startsWith('--only='))?.slice(7);
let previous=[];try{previous=JSON.parse(await readFile(new URL('manifest.json',directory),'utf8')).results;}catch{ /* First capture has no manifest. */ }
const results=only?previous.filter(result=>!result.file.startsWith(only)):[];
try{
  for(const site of projectWebsites.filter(site=>!only||site.file.startsWith(only))){
    const context=await browser.newContext({viewport:{width:1440,height:960},deviceScaleFactor:1,locale:'id-ID',reducedMotion:'reduce'});
    const page=await context.newPage(),temporary=new URL(site.file+'.tmp.jpg',directory);
    try{
      const response=await page.goto(site.url,{waitUntil:'domcontentloaded',timeout:30000});
      if(!response?.ok())throw new Error('HTTP '+response?.status());
      await page.waitForTimeout(1000);
      await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,3000))])).catch(error=>{if(!error.message.includes('Execution context was destroyed'))throw error;});await page.waitForTimeout(3500);
      if(site.dismiss)for(let attempt=0;attempt<3;attempt++){const close=page.locator(site.dismiss).first();if(!await close.isVisible())break;await close.click();await page.waitForTimeout(400);}
      const title=await page.title(),text=await page.locator('body').innerText();
      if(text.trim().length<35||/just a moment|access denied|domain.*(?:sale|expired)|website.*suspended|account.*suspended|coming soon|site can't be reached/i.test(title+' '+text.slice(0,1200)))throw new Error('No usable public website preview');
      await page.screenshot({path:fileURLToPath(temporary),type:'jpeg',quality:82,animations:'disabled',fullPage:false});
      const bytes=await readFile(temporary);await rename(temporary,new URL(site.file,directory));
      const result={...site,finalUrl:page.url(),title,capturedAt:new Date().toISOString(),sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,status:'captured'};
      results.push(result);console.log(`CAPTURED: ${site.url} -> ${site.file} (${bytes.length} bytes)`);
    }catch(error){await rm(temporary,{force:true});results.push({...site,status:'unavailable',error:error.message});console.log(`UNCHANGED: ${site.url} (${error.message.split('\n')[0]})`);}
    finally{await context.close();}
  }
}finally{await browser.close();}
await writeFile(new URL('manifest.json',directory),JSON.stringify({viewport:{width:1440,height:960},results},null,2)+'\n');
// Version the public URLs so a refreshed capture also replaces browser/SW caches.
const dataFile=new URL('../src/data/projects.js',import.meta.url);
let data=await readFile(dataFile,'utf8');
for(const result of results.filter(result=>result.status==='captured')){
  const path='/assets/projects/live/'+result.file;
  const escaped=path.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  data=data.replace(new RegExp(escaped+'(?:\\?v=[a-f0-9]+)?','g'),path+'?v='+result.sha256.slice(0,12));
}
await writeFile(dataFile,data);
console.log(`PREVIEWS: ${results.filter(result=>result.status==='captured').length}/${results.length} website captures; existing images kept on failure.`);
