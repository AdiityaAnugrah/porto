import { useEffect, useRef, useState } from 'react';
import { useActiveLocale } from '../../lib/i18n';
import PcPoster from './PcPoster';
import ProfileDetails from './ProfileDetails';
import {POWER_TIMINGS,requestPower,settlePower} from './pcPower';
import './workstation.css';

export default function PcSetup({ variant='ambient',onPowerChange }) {
  const root=useRef(null),host=useRef(null),api=useRef(null),actions=useRef(null),trigger=useRef(null);
  const [status,setStatus]=useState('loading'),[mode,setMode]=useState('work'),[selected,setSelected]=useState(null);
  const [powerState,setPowerState]=useState('on'),livePower=useRef('on');
  const id=useActiveLocale()==='id',interactive=variant==='interactive';
  const liveMode=useRef(mode);
  const open=(topic)=>{trigger.current=root.current?.querySelector(`[data-pc-action="${topic==='gaming'?'controller':topic}"]`);setSelected(topic);};
  useEffect(()=>{
    let cancelled=false,loading=false,visible=false,pending=false;
    const introduce=(topic,key)=>{
      if(!api.current){open(topic);return;}
      pending=true;
      api.current.animateIntro(topic,key,completed=>{pending=false;if(completed&&!cancelled&&livePower.current==='on')open(topic);});
    };
    const action=(name,key)=>{
      if(cancelled)return;
      if(name==='lights'){
        const next=requestPower(livePower.current);if(next===livePower.current)return;
        api.current?.cancelInteraction();pending=false;setSelected(null);livePower.current=next;setPowerState(next);api.current?.power(next);return;
      }
      if(name!=='context-lost'&&(pending||livePower.current!=='on'))return;
      root.current.dataset.lastAction=name;
      if(name==='work'||name==='gaming')setMode(name);
      if(name==='monitor')setMode(previous=>previous==='work'?'gaming':'work');
      if(name==='keyboard'||name==='developer'){setMode('work');introduce('developer',key);}
      if(name==='controller'){setMode('gaming');introduce('gaming',key);}
      if(name==='music')open('music');
      if(name==='context-lost'){api.current?.dispose();api.current=null;setSelected(null);setStatus('fallback');}
    };
    actions.current=action;
    const visibility=()=>api.current?.setVisible(visible&&!document.hidden);
    const observer=new IntersectionObserver(async([entry])=>{
      visible=entry.isIntersecting;visibility();
      if(!visible||loading||api.current)return;
      loading=true;
      try{const{createPcWorld}=await import('./PcWorld');if(cancelled)return;api.current=createPcWorld(host.current,{onAction:action,id,interactive});api.current.mode(liveMode.current==='gaming');api.current.power(livePower.current);visibility();setStatus('ready');}
      catch(error){if(!cancelled){root.current.dataset.error=error.message;setStatus('fallback');}}
    },{rootMargin:'100px'});
    observer.observe(root.current);document.addEventListener('visibilitychange',visibility);
    return()=>{cancelled=true;observer.disconnect();document.removeEventListener('visibilitychange',visibility);api.current?.dispose();api.current=null;};
  },[id,interactive]);
  useEffect(()=>{
    livePower.current=powerState;api.current?.power(powerState);onPowerChange?.(powerState);
    const delay=POWER_TIMINGS[powerState];if(!delay)return;
    const timer=setTimeout(()=>{const next=settlePower(powerState);livePower.current=next;setPowerState(next);},delay);
    return()=>clearTimeout(timer);
  },[powerState,onPowerChange]);
  useEffect(()=>{liveMode.current=mode;api.current?.mode(mode==='gaming');},[mode]);
  const close=()=>{setSelected(null);api.current?.dismissIntro();if(trigger.current?.isConnected)trigger.current.focus({preventScroll:true});};
  const busy=!!POWER_TIMINGS[powerState],available=powerState==='on';
  const powerLabel=id?({on:'Matikan PC',off:'Nyalakan PC','shutting-down':'PC sedang dimatikan',booting:'PC sedang dinyalakan'}[powerState]):({on:'Shut down PC',off:'Power on PC','shutting-down':'PC is shutting down',booting:'PC is starting'}[powerState]);
  return <div ref={root} className="scene-background pc-setup" data-status={status} data-mode={mode} data-variant={variant} data-power-state={powerState} data-lights={powerState==='off'?'off':'on'} aria-hidden={interactive?undefined:true}>
    <div ref={host} className="pc-world" role="img" aria-label={id?'Setup PC interaktif Aditya Anugrah':'Aditya Anugrah’s interactive PC setup'}/>
    {status!=='ready'&&<div className="pc-poster" aria-hidden="true"><PcPoster gaming={mode==='gaming'} powerState={powerState}/></div>}
    {interactive&&<>
      <div className="pc-object-targets">
        <button disabled={!available} className="pc-target pc-monitor-access" data-pc-action="monitor" type="button" aria-label={id?'Monitor: ganti tampilan Gaming dan Developer':'Monitor: switch Gaming and Developer displays'} onClick={()=>actions.current?.('monitor')}/>
        <button disabled={!available} className="pc-target" data-pc-action="developer" type="button" aria-label={id?'Keyboard: detail pekerjaan Aditya':'Keyboard: Aditya’s work details'} aria-haspopup="dialog" onClick={()=>actions.current?.('developer')}/>
        <button disabled={!available} className="pc-target" data-pc-action="controller" type="button" aria-label={id?'Controller: detail gaming Aditya':'Controller: Aditya’s gaming details'} aria-haspopup="dialog" onClick={()=>actions.current?.('controller')}/>
        <button disabled={!available} className="pc-target" data-pc-action="music" type="button" aria-label={id?'Speaker: detail musik Aditya':'Speaker: Aditya’s music details'} aria-haspopup="dialog" onClick={()=>actions.current?.('music')}/>
        <button className="pc-target" data-pc-action="lights" type="button" aria-label={powerLabel} aria-pressed={powerState==='on'||powerState==='shutting-down'} aria-disabled={busy} aria-busy={busy} onClick={()=>actions.current?.('lights')}/>
      </div>
      <span className="sr-only" role="status">{powerState==='on'?(id?'PC menyala.':'PC is on.'):powerState==='off'?(id?'PC mati.':'PC is off.'):powerLabel}</span>
      {selected&&<ProfileDetails topic={selected} onClose={close}/>}
    </>}
  </div>;
}
