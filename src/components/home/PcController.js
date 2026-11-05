import * as THREE from 'three';

export function createController() {
  const group=new THREE.Group();
  const white=new THREE.MeshStandardMaterial({color:'#eadfd4',roughness:.45});
  const dark=new THREE.MeshStandardMaterial({color:'#24232c',roughness:.8});
  const accent=new THREE.MeshStandardMaterial({color:'#b48068',roughness:.5});
  const shape=new THREE.Shape();
  shape.moveTo(-1.07,.28);shape.bezierCurveTo(-.95,.58,-.59,.58,-.4,.37);shape.lineTo(.4,.37);
  shape.bezierCurveTo(.59,.58,.95,.58,1.07,.28);shape.bezierCurveTo(1.18,.03,1.46,-.53,1.16,-.67);
  shape.bezierCurveTo(.91,-.8,.69,-.36,.48,-.31);shape.quadraticCurveTo(0,-.49,-.48,-.31);
  shape.bezierCurveTo(-.69,-.36,-.91,-.8,-1.16,-.67);shape.bezierCurveTo(-1.46,-.53,-1.18,.03,-1.07,.28);shape.closePath();
  const shell=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.2,bevelEnabled:true,bevelSize:.07,bevelThickness:.07,bevelSegments:3,curveSegments:16}),white);group.add(shell);
  const box=(w,h,d,x,y,z,material)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);group.add(m);};
  const disc=(r,d,x,y,z,material)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d,24),material);m.rotation.x=Math.PI/2;m.position.set(x,y,z);group.add(m);};
  box(.65,.3,.04,0,.17,.29,dark);
  for(const x of[-.37,.37]){disc(.19,.05,x,-.19,.29,dark);disc(.12,.09,x,-.19,.36,dark);}
  box(.29,.075,.045,-.77,.14,.29,dark);box(.075,.29,.05,-.77,.14,.295,dark);
  for(const[x,y]of[[.77,.29],[.92,.14],[.77,-.01],[.62,.14]])disc(.062,.06,x,y,.31,accent);
  for(const x of[-.72,.72])box(.44,.1,.08,x,.43,.08,dark);
  disc(.045,.025,0,-.18,.29,accent);
  return group;
}
