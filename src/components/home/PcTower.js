import * as THREE from 'three';
import {createCoolingLcd} from './CoolingLcd';

export function createPcTower({cyan,pink}) {
  const tower=new THREE.Group(),rotors=[];
  const chassis=new THREE.MeshStandardMaterial({color:'#141b25',metalness:.5,roughness:.48});
  const board=new THREE.MeshStandardMaterial({color:'#192b2a',metalness:.2,roughness:.75});
  const steel=new THREE.MeshStandardMaterial({color:'#68717b',metalness:.65,roughness:.4});
  const blades=new THREE.MeshStandardMaterial({color:'#6d7380',metalness:.35,roughness:.55});
  const black=new THREE.MeshStandardMaterial({color:'#121620',roughness:.8});
  const cube=new THREE.BoxGeometry(1,1,1);
  const add=(geometry,material,position,parent=tower)=>{
    const object=new THREE.Mesh(geometry,material);object.position.set(...position);parent.add(object);return object;
  };
  const box=(size,position,material=chassis,parent=tower)=>{const object=add(cube,material,position,parent);object.scale.set(...size);return object;};
  const cable=points=>add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(point=>new THREE.Vector3(...point))),16,.013,5,false),black,[0,0,0]);

  box([.62,.035,.94],[0,-.55,0]);box([.62,.035,.94],[0,.55,0]);
  box([.025,1.06,.91],[-.3,0,0]);box([.59,1.06,.025],[0,0,-.455]);
  box([.59,1.06,.025],[0,0,.455]);
  for(const z of[-.445,.445])box([.035,1.1,.035],[.3,0,z],steel);
  for(const x of[-.2,.2])for(const z of[-.33,.33])box([.12,.045,.13],[x,-.585,z]);

  const bladeShape=new THREE.Shape();
  bladeShape.moveTo(.12,.05);bladeShape.bezierCurveTo(.35,.12,.86,.02,.88,.34);bladeShape.bezierCurveTo(.73,.66,.27,.55,.11,.17);bladeShape.closePath();
  const bladeGeometry=new THREE.ExtrudeGeometry(bladeShape,{depth:.045,bevelEnabled:false,curveSegments:5});
  function fan(radius,position,ringMaterial,{side=false,speed=1}={}){
    const frame=new THREE.Group();frame.position.set(...position);if(side)frame.rotation.y=Math.PI/2;tower.add(frame);
    const ring=add(new THREE.TorusGeometry(radius,.012,6,28),ringMaterial,[0,0,.008],frame);ring.castShadow=false;
    add(new THREE.CircleGeometry(radius-.012,24),black,[0,0,-.012],frame);
    const rotor=new THREE.Group();frame.add(rotor);
    for(let n=0;n<6;n++){const blade=add(bladeGeometry,blades,[0,0,0],rotor);blade.scale.setScalar(radius);blade.rotation.z=n*Math.PI/3;}
    const hub=add(new THREE.CylinderGeometry(radius*.22,radius*.22,.024,14),steel,[0,0,.008],rotor);hub.rotation.x=Math.PI/2;
    rotors.push({object:rotor,speed});return frame;
  }
  fan(.185,[0,-.25,.482],pink);fan(.185,[0,.23,.482],cyan,{speed:1.08});

  box([.025,.78,.78],[-.255,.055,0],board);
  for(const z of[-.3,-.23,.28])box([.012,.58,.008],[-.238,.04,z],steel);
  const socket=box([.05,.23,.23],[-.224,.29,-.25],black);socket.name='CPU socket';
  const cpu=box([.075,.2,.2],[-.165,.29,-.25],steel);cpu.name='CPU heat spreader';
  const cooling=createCoolingLcd({rimMaterial:cyan});tower.add(cooling.group);
  for(const z of[.13,.23]){box([.05,.33,.045],[-.17,.22,z],black);box([.007,.29,.025],[-.14,.23,z],z>.2?pink:cyan);}
  box([.027,.1,.22],[-.22,.42,-.16],steel);
  const radiator=box([.43,.035,.78],[-.035,.49,0],black);radiator.name='AIO radiator';
  for(let n=0;n<12;n++)box([.4,.008,.014],[-.035,.511,-.35+n*.063],steel);
  const hoseA=cable([cooling.ports[0],[.1,.39,-.12],[.12,.36,-.27],[-.06,.47,-.34]]);hoseA.name='AIO coolant hose A';
  const hoseB=cable([cooling.ports[1],[.035,.405,-.24],[.1,.4,-.32],[.05,.47,-.34]]);hoseB.name='AIO coolant hose B';

  const gpu=new THREE.Group();gpu.name='GeForce RTX';tower.add(gpu);
  box([.46,.27,.74],[0,-.14,-.02],black,gpu);
  for(const z of[-.34,.30])box([.47,.015,.035],[0,-.02,z],steel,gpu);
  for(const z of[-.21,.17])fan(.105,[.239,-.14,z],steel,{side:true,speed:-.8});
  box([.007,.018,.64],[.238,.023,-.02],cyan,gpu);
  cable([[.2,.02,.18],[.26,.08,.22],[.25,-.28,.27],[.1,-.34,.29]]);
  box([.56,.2,.88],[0,-.43,0]);

  const label=document.createElement('canvas');label.width=512;label.height=96;
  const context=label.getContext('2d');
  if(context){context.fillStyle='#111821';context.fillRect(0,0,512,96);context.fillStyle='#bdc6c9';context.font='500 29px sans-serif';context.fillText('GEFORCE',20,60);context.fillStyle='#b4de8c';context.font='bold 66px sans-serif';context.fillText('RTX',240,72);}
  const badgeTexture=new THREE.CanvasTexture(label);badgeTexture.colorSpace=THREE.SRGBColorSpace;
  const badgeMaterial=new THREE.MeshBasicMaterial({map:badgeTexture,toneMapped:false});
  const badge=add(new THREE.PlaneGeometry(.62,.116),badgeMaterial,[.246,.058,-.02],gpu);badge.rotation.y=Math.PI/2;

  const glassMaterial=new THREE.MeshStandardMaterial({color:'#a0c6d7',transparent:true,opacity:.1,roughness:.24,metalness:.1,depthWrite:false,side:THREE.DoubleSide});
  const glass=add(new THREE.PlaneGeometry(.84,1.01),glassMaterial,[.324,0,0]);glass.name='Case side glass';glass.rotation.y=Math.PI/2;glass.renderOrder=2;
  for(const y of[-.48,.48])for(const z of[-.39,.39]){const screw=add(new THREE.CylinderGeometry(.012,.012,.012,8),steel,[.331,y,z]);screw.rotation.z=Math.PI/2;}
  box([.035,.68,.018],[.329,0,-.43],pink);
  for(const x of[-.16,-.07])box([.05,.015,.018],[x,.575,.25],black);
  const standby=new THREE.MeshStandardMaterial({color:'#33414b',emissive:'#9cbed3',emissiveIntensity:.8,roughness:.4});
  const power=add(new THREE.CylinderGeometry(.027,.027,.01,16),standby,[.2,.575,.27]);
  power.name='PC power';
  tower.traverse(object=>{if(object.isMesh){object.userData.action='lights';object.receiveShadow=true;}});
  // Cache case shadows; rotating blades do not redraw the shadow map each frame.
  for(const object of tower.children)if(object.isMesh&&!object.material.transparent)object.castShadow=true;
  return {tower,rotors,update(now,animate){cooling.update(now,animate);},get coolingFrames(){return cooling.frames;},setPower(value,{screens=value}={}){badgeMaterial.color.setScalar(value?1:0);standby.emissiveIntensity=value?.8:.1;cooling.setPower(screens);},dispose(){badgeTexture.dispose();cooling.dispose();}};
}
