import * as THREE from 'three';

// Original canvas illustration: no remote GIF, player, or second animation timer.
export function drawCoolingAnime(ctx,time=0){
  const sky=ctx.createLinearGradient(0,0,256,256);sky.addColorStop(0,'#122f49');sky.addColorStop(1,'#342844');ctx.fillStyle=sky;ctx.fillRect(0,0,256,256);
  for(let n=0;n<12;n++){ctx.fillStyle=n%2?'#9acde177':'#d8b9e966';ctx.beginPath();ctx.arc(20+(n*67)%220,18+(n*43)%208,1+Math.sin(time+n)*.35,0,Math.PI*2);ctx.fill();}
  ctx.save();ctx.translate(0,Math.sin(time*1.4)*1.7);
  ctx.fillStyle='#202a41';ctx.beginPath();ctx.ellipse(128,239,82,49,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#6cd0db';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(72,249);ctx.lineTo(81,217);ctx.lineTo(110,203);ctx.moveTo(184,249);ctx.lineTo(175,217);ctx.lineTo(146,203);ctx.stroke();
  ctx.fillStyle='#e4b29e';ctx.fillRect(114,181,28,31);
  ctx.strokeStyle='#122033';ctx.lineWidth=13;ctx.beginPath();ctx.arc(128,124,65,Math.PI,Math.PI*2);ctx.stroke();
  ctx.fillStyle='#b9dae2';ctx.beginPath();ctx.moveTo(71,148);ctx.bezierCurveTo(53,81,90,49,132,58);ctx.bezierCurveTo(182,44,205,91,185,153);ctx.lineTo(171,173);ctx.lineTo(82,166);ctx.fill();
  ctx.fillStyle='#f2ceba';ctx.beginPath();ctx.ellipse(128,139,46,56,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#d8a891';ctx.beginPath();ctx.moveTo(168,111);ctx.bezierCurveTo(181,141,169,180,132,194);ctx.bezierCurveTo(154,175,161,147,158,113);ctx.fill();
  ctx.fillStyle='#dce8ee';ctx.beginPath();ctx.moveTo(73,133);ctx.lineTo(79,94);ctx.bezierCurveTo(88,58,156,55,178,84);ctx.lineTo(184,128);ctx.lineTo(162,111);ctx.lineTo(150,92);ctx.lineTo(139,128);ctx.lineTo(124,100);ctx.lineTo(103,131);ctx.lineTo(103,111);ctx.lineTo(88,143);ctx.lineTo(82,123);ctx.closePath();ctx.fill();
  ctx.fillStyle='#89bdcf';ctx.beginPath();ctx.moveTo(88,84);ctx.lineTo(102,74);ctx.lineTo(102,112);ctx.lineTo(89,136);ctx.lineTo(94,105);ctx.closePath();ctx.fill();
  const phase=time%6,blink=phase>5.5&&phase<5.72;
  for(const x of[109,148]){
    ctx.strokeStyle='#283049';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x-11,132);ctx.quadraticCurveTo(x,127,x+10,133);ctx.stroke();
    if(blink){ctx.beginPath();ctx.moveTo(x-11,145);ctx.quadraticCurveTo(x,150,x+11,145);ctx.stroke();continue;}
    ctx.fillStyle='#fff4ed';ctx.beginPath();ctx.ellipse(x,145,12,11,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#8870bc';ctx.beginPath();ctx.ellipse(x+1,146,7,10,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#273c68';ctx.beginPath();ctx.ellipse(x+1,147,3,7,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x-1,141,2.8,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#263348';ctx.beginPath();ctx.moveTo(x-12,142);ctx.quadraticCurveTo(x,131,x+12,141);ctx.stroke();
  }
  ctx.strokeStyle='#ba807a';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(126,159);ctx.lineTo(124,165);ctx.lineTo(129,165);ctx.moveTo(120,177);ctx.quadraticCurveTo(129,182,137,175);ctx.stroke();
  for(const x of[66,181]){ctx.fillStyle='#26334d';ctx.beginPath();ctx.roundRect(x,120,15,39,6);ctx.fill();ctx.fillStyle='#70d6db';ctx.fillRect(x+3,127,3,23);}
  ctx.strokeStyle='#667e9d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(186,152);ctx.quadraticCurveTo(180,174,154,174);ctx.stroke();ctx.fillStyle='#91dce1';ctx.fillRect(149,171,9,5);
  ctx.restore();
}

export function createCoolingLcd({rimMaterial}){
  const group=new THREE.Group();group.name='Anime cooling LCD';group.position.set(-.02,.29,-.25);group.rotation.y=Math.PI/2;
  const casingMaterial=new THREE.MeshStandardMaterial({color:'#2b3545',metalness:.55,roughness:.36});
  const steel=new THREE.MeshStandardMaterial({color:'#727d89',metalness:.7,roughness:.34});
  const copper=new THREE.MeshStandardMaterial({color:'#a77250',metalness:.75,roughness:.4});
  const part=(name,geometry,material,x,y,z)=>{const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;};
  const cylinder=(name,radius,depth,material,x,y,z)=>{const mesh=part(name,new THREE.CylinderGeometry(radius,radius,depth,32),material,x,y,z);mesh.rotation.x=Math.PI/2;return mesh;};
  // Cold plate contacts the CPU's x=-0.1275 face; the LCD remains recessed from glass.
  cylinder('CPU cold plate',.125,.024,copper,0,0,-.0955);
  part('CPU mounting bracket',new THREE.BoxGeometry(.34,.34,.025),steel,0,0,-.083);
  for(const x of[-.13,.13])for(const y of[-.13,.13]){
    cylinder('Motherboard mounting post',.011,.165,steel,x,y,-.1575);
    cylinder('Pump mounting screw',.018,.018,steel,x,y,-.065);
    part('Screw slot',new THREE.BoxGeometry(.018,.003,.002),casingMaterial,x,y,-.054);
  }
  cylinder('Pump rear collar',.153,.045,casingMaterial,0,0,-.058);
  cylinder('CPU pump housing',.171,.12,casingMaterial,0,0,-.004);
  for(const z of[-.04,-.008,.025])part('Pump cooling rib',new THREE.TorusGeometry(.171,.0035,5,40),steel,0,0,z);
  cylinder('LCD bezel',.166,.018,casingMaterial,0,0,.061);
  const rim=part('LCD light ring',new THREE.TorusGeometry(.159,.008,6,40),rimMaterial,0,0,.079);rim.castShadow=false;
  for(const x of[-.07,.07]){
    const fitting=part('Coolant hose fitting',new THREE.CylinderGeometry(.024,.024,.08,12),casingMaterial,x,.14,-.015);
    for(const y of[.125,.145,.165])part('Hose fitting collar',new THREE.TorusGeometry(.024,.003,5,12),steel,x,y,-.015).rotation.x=Math.PI/2;
    fitting.receiveShadow=true;
  }
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=256;const context=canvas.getContext('2d');
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
  const material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
  const display=new THREE.Mesh(new THREE.CircleGeometry(.148,48),material);display.position.z=.077;display.name='Cooling LCD pixels';group.add(display);
  group.updateMatrixWorld(true);
  const ports=[-.07,.07].map(x=>group.localToWorld(new THREE.Vector3(x,.18,-.015)).toArray());
  let powered=true,lastDraw=-Infinity,lastAnimated=null,frames=0;
  function update(now,animate){
    if(!powered||!context)return;
    if(lastAnimated===animate&&(!animate||now-lastDraw<125))return;
    drawCoolingAnime(context,animate?now/1000:1.2);texture.needsUpdate=true;lastDraw=now;lastAnimated=animate;frames++;
  }
  update(0,false);
  return {group,ports,update,get frames(){return frames;},setPower(value){powered=value;material.color.setScalar(value?1:0);lastAnimated=null;},dispose(){texture.dispose();}};
}
