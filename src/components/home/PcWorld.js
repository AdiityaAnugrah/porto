import * as THREE from 'three';
import { createController } from './PcController';
import { createMonitorLoop } from './monitorLoop';
import { createPcTower } from './PcTower';
import { createDeskLeg } from './DeskLeg';

export function createPcWorld(host, { onAction, id, interactive = false }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;
  const canvas = renderer.domElement;
  canvas.className = 'pc-world-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 45);
  const target = new THREE.Vector3(0, 1.35, 0);
  const roomLight=new THREE.HemisphereLight('#e9d8e2', '#4a3538', 2.8);scene.add(roomLight);
  const sun = new THREE.DirectionalLight('#ffe4c8', 4);
  sun.position.set(-3, 7, 5); sun.intensity = 3; sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  Object.assign(sun.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 });
  sun.shadow.normalBias = .065;
  sun.shadow.bias = -.0001;
  scene.add(sun);
  const fill = new THREE.DirectionalLight('#aca8ef', 1.2); fill.position.set(4, 3, -3); scene.add(fill);
  const meshes = [], geometries = new Set(), materials = new Set();
  const palette = {};
  const material = (color, extra = {}) => { const m = new THREE.MeshStandardMaterial({ color, roughness: .7, ...extra }); materials.add(m); return m; };
  for (const [key, color] of Object.entries({ wood: '#986147', dark: '#272632', metal: '#57525d', ivory: '#ebd9c9', accent: '#e7a68b', mat: '#25212b', leaf: '#6a8d70' })) palette[key] = material(color);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1); geometries.add(boxGeometry);
  function mesh(geometry, mat, position, action, parent = scene) {
    geometries.add(geometry);
    const object = new THREE.Mesh(geometry, mat);
    object.position.set(...position); object.castShadow = true; object.receiveShadow = true;
    if (action) { object.userData.action = action; meshes.push(object); }
    parent.add(object); return object;
  }
  function box(size, position, color = 'dark', action, parent) {
    const object = mesh(boxGeometry, palette[color] || color, position, action, parent);
    object.scale.set(...size); return object;
  }
  function cylinder(radius, height, position, color, action, parent) {
    return mesh(new THREE.CylinderGeometry(radius, radius, height, 24), palette[color] || color, position, action, parent);
  }
  const neonCyan = material('#1788bd', { emissive: '#05b8ff', emissiveIntensity: 1.7, roughness: .3 });
  const neonPink = material('#a244cc', { emissive: '#bd24ff', emissiveIntensity: 1.5, roughness: .3 });
  function strip(vertices, surface, radius = .009, parent = scene, action) {
    const curve = new THREE.CurvePath();
    for(let i=1;i<vertices.length;i++)curve.add(new THREE.LineCurve3(new THREE.Vector3(...vertices[i-1]),new THREE.Vector3(...vertices[i])));
    return mesh(new THREE.TubeGeometry(curve,vertices.length*8,radius,6,false),surface,[0,0,0],action,parent);
  }
  const floor = mesh(new THREE.CircleGeometry(2.65, 64), material('#2a222b'), [0, .005, 0]); floor.rotation.x = -Math.PI / 2; floor.castShadow = false;
  const outline=[[-2.05,-.98],[2.05,-.98],[2.16,.66],[1.78,1.12],[.35,1.03],[-.35,1.03],[-1.78,1.12],[-2.16,.66]];
  const deskShape=new THREE.Shape();outline.forEach(([x,z],index)=>index?deskShape.lineTo(x,z):deskShape.moveTo(x,z));deskShape.closePath();
  const desk=mesh(new THREE.ExtrudeGeometry(deskShape,{depth:.14,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,curveSegments:1}),material('#19212c',{metalness:.35,roughness:.44}),[0,1.53,0]);desk.rotation.x=Math.PI/2;
  strip([[-2.05,1.568,-.94],[-2.12,1.568,.65],[-1.77,1.568,1.09],[-.36,1.568,1.01]],neonCyan,.012);
  strip([[.36,1.568,1.01],[1.77,1.568,1.09],[2.12,1.568,.65],[2.05,1.568,-.94]],neonPink,.012);
  for(const x of[-1.67,1.67]){
    box([.19,.08,1.72],[x,.045,.02],'dark');
    for(const z of[-.66,.66])scene.add(createDeskLeg({x,z,bodyMaterial:palette.dark,ledMaterial:x<0?neonCyan:neonPink}));
  }
  box([3.4,.11,.1],[0,.61,-.7],'dark');
  box([3.05,.018,1.23],[-.21,1.57,.16],'mat');
  strip([[-1.7,1.584,-.43],[-1.7,1.584,.75],[1.29,1.584,.75],[1.29,1.584,-.43],[-1.7,1.584,-.43]],neonCyan,.006);
  const underCyan=new THREE.PointLight('#13bfff',3.6,4,2);underCyan.position.set(-1.25,.9,.4);scene.add(underCyan);
  const underPink=new THREE.PointLight('#bd44ff',3.1,4,2);underPink.position.set(1.25,.9,.4);scene.add(underPink);
  box([.64, .06, .42], [-.38, 1.62, -.48], 'metal', 'monitor');
  box([.1, .48, .1], [-.38, 1.88, -.56], 'metal', 'monitor');
  const monitor = new THREE.Group(); monitor.position.set(-.38, 2.37, -.55); scene.add(monitor);
  box([1.82, 1.13, .12], [0, 0, 0], 'dark', 'monitor', monitor);
  const display = document.createElement('canvas'); display.width = 768; display.height = 448;
  const texture = new THREE.CanvasTexture(display); texture.colorSpace = THREE.SRGBColorSpace;
  const screenMaterial = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }); materials.add(screenMaterial);
  mesh(new THREE.PlaneGeometry(1.7, .99), screenMaterial, [0, .015, .066], 'monitor', monitor);
  let gaming = false, light = true, exploded = false, visible = true, disposed = false, frame = 0, yaw = .62, scroll = 0, tween = null, keyPress = null;
  let powerState='on',screenPowered=true;
  let fanTimer=0,lastFanTime=0,fanFrames=0;
  const monitorLoop=createMonitorLoop(host,'work',id,{canvas:display,onFrame:()=>{texture.needsUpdate=true;invalidate();}});
  const accents = material('#8bddff', { emissive: '#00baff', emissiveIntensity: 2.3 });
  const hardware=createPcTower({cyan:neonCyan,pink:neonPink}),pc=hardware.tower;
  pc.position.set(1.27,2.13,-.34);scene.add(pc);
  pc.traverse(object=>{if(object.isMesh)meshes.push(object);});
  host.dataset.gpu='GeForce RTX';host.dataset.fanCount=String(hardware.rotors.length);host.dataset.pcPower='on';
  const keyboard = new THREE.Group(); keyboard.position.set(-.38, 1.62, .33); scene.add(keyboard);
  box([1.53, .055, .54], [0, 0, 0], 'metal', 'keyboard', keyboard);
  box([1.49,.015,.51],[0,.031,0],neonCyan,'keyboard',keyboard);
  const keys=[];
  for (let row = 0; row < 4; row++) for (let col = 0; col < 13; col++) keys.push(box([.089, .043, .082], [-.67 + col * .111, .045, -.17 + row * .105], col < 4 && row > 0 ? 'accent' : 'ivory', 'keyboard', keyboard));
  keys.push(box([.58, .044, .07], [-.03, .045, .238], 'ivory', 'keyboard', keyboard));
  const mouse = mesh(new THREE.SphereGeometry(1, 20, 12), palette.ivory, [.7, 1.65, .4], 'keyboard'); mouse.scale.set(.13, .07, .2);
  box([.025, .012, .06], [.7, 1.72, .35], 'dark', 'keyboard');
  const pad = createController(); pad.scale.setScalar(.34); pad.position.set(-1.25,1.64,.77); pad.rotation.set(-Math.PI/2,0,-.18); scene.add(pad);
  const padHome=pad.position.clone(),padRotation=pad.rotation.clone();
  const keyHomes=new Map(keys.map(key=>[key,key.position.y]));
  let intro=null;
  host.dataset.intro='idle';
  function restoreKeys(){for(const [key,y]of keyHomes)key.position.y=y;host.dataset.pressedKeys='0';}
  function cancelIntro(){
    const done=intro?.done;intro=null;restoreKeys();pad.position.copy(padHome);pad.rotation.copy(padRotation);
    host.dataset.intro='idle';host.dataset.padLift='0';renderer.shadowMap.needsUpdate=true;done?.(false);
  }
  pad.traverse(object => { if (object.isMesh) { object.userData.action='controller'; meshes.push(object); } });
  for (const x of [-1.52, .66]) {
    box([.25, .44, .25], [x, 1.79, -.64], 'dark', 'music');
    const cone = cylinder(.075, .025, [x, 1.82, -.502], 'metal', 'music'); cone.rotation.x = Math.PI / 2;
  }
  strip([[-1.72,1.66,-.02],[-1.72,1.9,-.02],[-1.61,2.04,-.02],[-1.5,1.9,-.02],[-1.5,1.66,-.02]],neonPink,.018);
  for(const x of[-1.74,-1.48])box([.07,.22,.15],[x,1.73,-.02],'dark','music');
  const ray = new THREE.Raycaster(), pointer = new THREE.Vector2();
  function render() {
    frame = 0; if (!visible || disposed) return;
    clearTimeout(fanTimer);fanTimer=0;
    const fansRunning=light&&!reduced.matches&&!document.hidden;
    if(fansRunning){
      const now=performance.now(),delta=lastFanTime?Math.min((now-lastFanTime)/1000,.1):0;lastFanTime=now;
      for(const rotor of hardware.rotors)rotor.object.rotation.z=(rotor.object.rotation.z+delta*(gaming?7.2:4.8)*rotor.speed)%(Math.PI*2);
      host.dataset.fanFrames=String(++fanFrames);
    }else lastFanTime=0;
    host.dataset.fanState=!light?'off':reduced.matches?'reduced':'spinning';
    host.dataset.fanAngle=hardware.rotors[0].object.rotation.z.toFixed(4);
    hardware.update(performance.now(),!reduced.matches);
    host.dataset.coolingScreen='anime';host.dataset.coolingFrames=String(hardware.coolingFrames);host.dataset.coolingState=!screenPowered?'off':reduced.matches?'static':'playing';
    if(intro){
      const current=intro,t=Math.min(1,(performance.now()-current.start)/current.duration),eased=1-(1-t)**3;
      if(current.topic==='gaming'){
        pad.position.copy(padHome);pad.position.y+=eased*.36;pad.rotation.x=padRotation.x+eased*.32;pad.rotation.z=padRotation.z-eased*.12;
      }else if(current.topic==='return'){
        pad.position.lerpVectors(current.from,padHome,eased);pad.rotation.x=THREE.MathUtils.lerp(current.rotation.x,padRotation.x,eased);pad.rotation.z=THREE.MathUtils.lerp(current.rotation.z,padRotation.z,eased);
      }else{
        restoreKeys();const beat=t*current.sequence.length,index=Math.min(Math.floor(beat),current.sequence.length-1),key=current.sequence[index];
        key.position.y=keyHomes.get(key)-Math.sin((beat%1)*Math.PI)*.032;
        host.dataset.pressedKeys=String(index+1);
      }
      host.dataset.padLift=(pad.position.y-padHome.y).toFixed(3);renderer.shadowMap.needsUpdate=true;
      if(t===1){intro=null;restoreKeys();host.dataset.intro=current.topic==='gaming'?'held':'idle';current.done?.(true);}
    }
    if (keyPress) {
      const t=Math.min(1,(performance.now()-keyPress.start)/260);
      keyPress.object.position.y=keyPress.base-Math.sin(t*Math.PI)*.026;
      renderer.shadowMap.needsUpdate=true;
      if(t===1)keyPress=null;
    }
    if (tween) {
      const t = Math.min(1, (performance.now() - tween.start) / 420);
      const eased = 1 - (1 - t) ** 3;
      tween.parts.forEach(([object, from, to]) => object.position.lerpVectors(from, to, eased));
      renderer.shadowMap.needsUpdate=true;
      if (t === 1) tween = null;
    }
    const angle = yaw + scroll * .32;
    const radius = host.clientWidth < 400 ? 8.3 : 7.8;
    camera.position.set(Math.sin(angle) * radius, 4.5 + scroll * .5, Math.cos(angle) * radius);
    camera.lookAt(target); renderer.render(scene, camera);
    const facing=camera.position.z>monitor.position.z;
    monitorLoop.visible(visible&&facing&&!document.hidden);
    host.dataset.yaw = angle.toFixed(3);
    for (const [action,position] of Object.entries({monitor:[-.38,2.38,-.47],developer:[-.38,1.69,.33],controller:[pad.position.x,pad.position.y+.07,pad.position.z],music:[-1.52,1.88,-.51],lights:[1.47,2.705,-.07]})) {
      const button=host.parentElement.querySelector(`[data-pc-action="${action}"]`);
      if(button){const point=new THREE.Vector3(...position).project(camera);button.style.left=`${(point.x*.5+.5)*host.clientWidth}px`;button.style.top=`${(-point.y*.5+.5)*host.clientHeight}px`;}
    }
    if (tween || keyPress || intro) invalidate();
    if(fansRunning)fanTimer=setTimeout(()=>{fanTimer=0;invalidate();},1000/24);
  }
  function invalidate() { if (!frame && visible && !disposed) frame = requestAnimationFrame(render); }
  function resize() { const { width, height } = host.getBoundingClientRect(); if (!width || !height) return; camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false); invalidate(); }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  function onScroll() { if (reduced.matches || !visible) return; const rect = host.getBoundingClientRect(); scroll = THREE.MathUtils.clamp((innerHeight * .4 - rect.top - rect.height * .5) / innerHeight, -1, 1); invalidate(); }
  function hit(event) { const rect = canvas.getBoundingClientRect(); pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1); ray.setFromCamera(pointer, camera); return ray.intersectObjects(meshes, false)[0]; }
  let drag = null;
  const down = event => { if (event.button !== 0) return; drag = { x: event.clientX, y: event.clientY, yaw, moved: false, touch: event.pointerType === 'touch' }; if (!drag.touch) canvas.setPointerCapture(event.pointerId); };
  const move = event => {
    if (drag) {
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (Math.abs(dx) > 7 && (!drag.touch || Math.abs(dx) > Math.abs(dy))) { drag.moved = true; yaw = THREE.MathUtils.clamp(drag.yaw + dx * .005, -1.1, 1.5); invalidate(); }
    } else {const action=hit(event)?.object.userData.action;canvas.style.cursor=action&&(powerState==='on'||action==='lights')?'pointer':'grab';}
  };
  const up = event => {
    if (!drag) return;
    const clicked = !drag.moved && Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<8;
    drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);
    if(clicked){const intersection=hit(event);if(!intersection)return;const action=intersection.object.userData.action;
      if(powerState==='on'||action==='lights')onAction(action,intersection.object);
    }
  };
  const cancel = () => { drag = null; };
  const lost = event => { event.preventDefault(); onAction('context-lost'); };
  if(interactive){canvas.addEventListener('pointerdown', down);canvas.addEventListener('pointermove', move);canvas.addEventListener('pointerup', up);canvas.addEventListener('pointercancel', cancel);}
  canvas.addEventListener('webglcontextlost', lost);
  window.addEventListener('scroll', onScroll, { passive: true });
  const motionChange = () => { scroll = 0;clearTimeout(fanTimer);fanTimer=0;lastFanTime=0;if(reduced.matches&&intro){intro.start=-Infinity;}invalidate(); }; reduced.addEventListener('change', motionChange);
  resize();
  function applyPower(next){
    if(!['on','off','booting','shutting-down'].includes(next))return;
    powerState=next;light=next!=='off';screenPowered=next==='on'||next==='shutting-down';clearTimeout(fanTimer);fanTimer=0;lastFanTime=0;
    const level=next==='on'?1:next==='shutting-down'?.55:next==='booting'?.3:0;
    const room=next==='off'?.04:next==='booting'?.32:next==='shutting-down'?.65:1;
    roomLight.intensity=2.8*room;sun.intensity=3*room;fill.intensity=1.2*room;
    hardware.setPower(light,{screens:screenPowered});monitorLoop.power(next);
    host.dataset.pcPower=light?'on':'off';host.dataset.powerState=next;host.dataset.ledLevel=String(level);host.dataset.roomLevel=String(room);
    accents.emissiveIntensity=2.3*level;neonCyan.emissiveIntensity=(gaming?2.2:1.7)*level;neonPink.emissiveIntensity=(gaming?2.1:1.5)*level;
    neonCyan.color.set(next==='off'?'#090c10':'#1788bd');neonPink.color.set(next==='off'?'#090c10':'#a244cc');
    underCyan.visible=level>0;underPink.visible=level>0;underCyan.intensity=(gaming?4.2:3.6)*level;underPink.intensity=(gaming?3.8:3.1)*level;invalidate();
  }
  return {
    setVisible(value) { visible = value;monitorLoop.visible(value&&!document.hidden); if (!value) { clearTimeout(fanTimer);fanTimer=0;lastFanTime=0;host.dataset.fanState='paused';host.dataset.coolingState='paused';cancelIntro();cancelAnimationFrame(frame); frame = 0; drag = null; } else { onScroll(); invalidate(); } },
    rotate(delta) { yaw = THREE.MathUtils.clamp(yaw + delta, -1.1, 1.5); invalidate(); },
    reset() { yaw = .62; scroll = 0; invalidate(); },
    mode(value) { gaming = value;monitorLoop.source(gaming?'gaming':'work');applyPower(powerState); },
    power:applyPower,
    cancelInteraction(){cancelIntro();if(keyPress){keyPress.object.position.y=keyPress.base;keyPress=null;}invalidate();},
    animateIntro(topic,object,done){
      cancelIntro();if(disposed||!visible||powerState!=='on'){done(false);return;}
      const sequence=[keys.includes(object)?object:keys[19],...([27,20,32,22,40,12,49].map(index=>keys[index]))];
      intro={topic,sequence,done,start:performance.now(),duration:topic==='gaming'?680:880};
      host.dataset.intro=topic==='gaming'?'lifting':'typing';
      if(reduced.matches)intro.start=-Infinity;
      invalidate();
    },
    dismissIntro(){
      if(pad.position.distanceToSquared(padHome)<.00001){cancelIntro();invalidate();return;}
      intro={topic:'return',from:pad.position.clone(),rotation:pad.rotation.clone(),start:performance.now(),duration:280};host.dataset.intro='returning';
      if(reduced.matches)intro.start=-Infinity;invalidate();
    },
    pressKey(object) {
      if(keyPress)keyPress.object.position.y=keyPress.base;
      const key=keys.includes(object)?object:keys[19];
      if(!reduced.matches)keyPress={object:key,base:key.position.y,start:performance.now()};invalidate();
    },
    lights(value) {applyPower(value?'on':'off');},
    explode(value) {
      exploded = value;
      const parts = [[monitor, [-.38, exploded ? 2.72 : 2.37, -.55]], [pc, [exploded ? 1.78 : 1.27, 2.13, -.34]], [keyboard, [-.38, 1.62, exploded ? .78 : .33]], [pad, [exploded ? -1.6 : -1.2, 1.67, .7]]];
      if (reduced.matches) { parts.forEach(([object, to]) => object.position.set(...to)); tween = null; }
      else tween = { start: performance.now(), parts: parts.map(([object, to]) => [object, object.position.clone(), new THREE.Vector3(...to)]) };
      invalidate();
    },
    dispose() {
      disposed = true;clearTimeout(fanTimer); cancelAnimationFrame(frame); resizeObserver.disconnect(); window.removeEventListener('scroll', onScroll); reduced.removeEventListener('change', motionChange);
      cancelIntro();monitorLoop.dispose();hardware.dispose();
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', cancel); canvas.removeEventListener('webglcontextlost', lost);
      scene.traverse(object=>{if(object.geometry)geometries.add(object.geometry);if(object.material)(Array.isArray(object.material)?object.material:[object.material]).forEach(m=>materials.add(m));});
      geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); texture.dispose(); renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    },
  };
}
