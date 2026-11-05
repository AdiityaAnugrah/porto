import {POWER_TIMINGS} from './pcPower';

export function drawMonitorLoop(ctx, { gaming, time = 0, id = true, power='on' }) {
  const w=768,h=448,phase=(time%12)/12;
  if(power!=='on'){
    ctx.fillStyle=power==='off'?'#000000':'#080e16';ctx.fillRect(0,0,w,h);
    if(power==='off')return;
    const boot=power==='booting',progress=Math.min(.98,time*1000/POWER_TIMINGS[power]);
    ctx.strokeStyle='#83bfcf';ctx.lineWidth=4;ctx.beginPath();ctx.arc(384,152,27,time*2,time*2+Math.PI*1.45);ctx.stroke();
    ctx.fillStyle='#e4edf3';ctx.textAlign='center';ctx.font='500 29px sans-serif';ctx.fillText(id?(boot?'Menyalakan PC':'Mematikan PC'):(boot?'Starting PC':'Shutting down'),384,237);
    ctx.fillStyle='#91a3b4';ctx.font='19px sans-serif';ctx.fillText(id?(boot?'Menyiapkan sistem…':'Menyelesaikan sesi…'):(boot?'Preparing your system…':'Finishing your session…'),384,278);
    ctx.fillStyle='#243443';ctx.fillRect(252,321,264,3);ctx.fillStyle='#83bfcf';ctx.fillRect(252,321,264*progress,3);ctx.textAlign='start';return;
  }
  ctx.fillStyle=gaming?'#101626':'#131d27';ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#d9e6ef';ctx.font='20px monospace';ctx.fillText('ADITYA ANUGRAH',30,36);
  ctx.fillStyle=gaming?'#6589a7':'#86b8c6';ctx.font='16px monospace';ctx.fillText(gaming?'GAMING / STEAM + PUBG':'WORK / FULL-STACK',470,36);
  ctx.fillStyle='#334452';ctx.fillRect(28,54,712,1);
  if(!gaming){
    ctx.fillStyle='#1d2b37';ctx.fillRect(28,74,712,38);ctx.fillStyle='#a8c2d0';ctx.font='18px monospace';ctx.fillText('portfolio / app.jsx',48,99);
    const lines=["import { ideas } from './process';","","function Portfolio() {","  return (","    <Experience>","      <Design />","      <Build stack=\"full-stack\" />","      <Ship />","    </Experience>","  );","}"];
    const characters=Math.floor((.12+phase*.88)*lines.join('').length);
    let remaining=characters;
    ctx.font='20px monospace';
    lines.forEach((line,index)=>{
      ctx.fillStyle='#6f8495';ctx.fillText(String(index+1).padStart(2,' '),46,144+index*24);
      ctx.fillStyle=index%3===0?'#8bd2d6':index%3===1?'#d8b8db':'#d5e0e6';
      const text=line.slice(0,Math.max(0,remaining));ctx.fillText(text,94,144+index*24);remaining-=line.length;
      if(remaining<0&&remaining>=-line.length){ctx.fillStyle='#bce4df';if(Math.floor(time*2)%2===0)ctx.fillRect(94+text.length*12.05,128+index*24,2,20);}
    });
  }else{
    const skyline=186+Math.sin(phase*Math.PI*2)*5;
    const sky=ctx.createLinearGradient(0,74,0,skyline+50);sky.addColorStop(0,'#141c32');sky.addColorStop(1,'#313354');ctx.fillStyle=sky;ctx.fillRect(28,74,712,205);
    for(let n=0;n<15;n++){
      const x=28+n*49,building=35+(Math.sin(n*12.3)+1)*38;
      ctx.fillStyle=n%2?'#19243b':'#1c2940';ctx.fillRect(x,skyline-building,40,building+75);
      ctx.fillStyle=n%3?'#426b89':'#9c6aaf';for(let y=skyline-building+13;y<skyline+30;y+=17)ctx.fillRect(x+9,y,4,5);
    }
    ctx.strokeStyle='#4e688c';ctx.lineWidth=1;
    for(let n=0;n<10;n++){const x=-180+n*125;ctx.beginPath();ctx.moveTo(384,skyline+42);ctx.lineTo(x,425);ctx.stroke();}
    for(let n=0;n<7;n++){const y=skyline+45+((n/7+phase*.35)%1)**2*190;ctx.beginPath();ctx.moveTo(29,y);ctx.lineTo(739,y);ctx.stroke();}
    ctx.strokeStyle='#79bfd2';ctx.lineWidth=2;ctx.beginPath();ctx.arc(384,235,42+Math.sin(phase*Math.PI*2)*4,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='#b6d2dd';ctx.font='18px monospace';ctx.fillText(id?'Waktu untuk rehat.':'Time for a break.',48,401);
    ctx.fillStyle='#b991cc';ctx.fillRect(575,391,130,2);
  }
}

export function createMonitorLoop(surface, initialMode='work', id=true, {canvas=document.createElement('canvas'),onFrame=()=>{}}={}) {
  canvas.className='pc-loop-canvas';canvas.width=768;canvas.height=448;canvas.setAttribute('aria-hidden','true');
  const ctx=canvas.getContext('2d');
  let mode=initialMode,power='on',active=false,frame=0,last=0,lastDraw=0,elapsed=0,disposed=false,draws=0;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const draw=()=>{if(!ctx)return;drawMonitorLoop(ctx,{gaming:mode==='gaming',time:media.matches?(power==='on'?7:0):elapsed,id,power});surface.dataset.screenFrames=++draws;surface.dataset.screenMode=mode;surface.dataset.screenPower=power;surface.dataset.screenState=power!=='on'?power:media.matches?'static':'running';onFrame();};
  const tick=now=>{
    frame=0;if(!active||disposed||document.hidden||power==='off')return;
    if(now-lastDraw>=1000/12){elapsed+=last?Math.min((now-last)/1000,.3):0;last=now;lastDraw=now;draw();}
    if(!media.matches)frame=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(frame);frame=0;last=0;if(!active||disposed||document.hidden){surface.dataset.screenState='paused';return;}draw();if(!media.matches&&power!=='off')frame=requestAnimationFrame(tick);};
  media.addEventListener('change',sync);draw();
  return {
    source(next){if(!['gaming','work'].includes(next)||mode===next)return;mode=next;elapsed=0;draw();},
    power(next){if(!['on','off','booting','shutting-down'].includes(next)||next===power)return;power=next;elapsed=0;last=0;draw();sync();},
    visible(value){if(active===value)return;active=value;sync();},
    resume(){sync();},
    dispose(){disposed=true;cancelAnimationFrame(frame);media.removeEventListener('change',sync);canvas.remove();},
  };
}
