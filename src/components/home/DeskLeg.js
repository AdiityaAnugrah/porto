import * as THREE from 'three';

export function createDeskLeg({x,z,bodyMaterial,ledMaterial}) {
  const support=new THREE.Group();
  support.name=z>0?'desk-leg-front':'desk-leg-back';
  support.position.set(x,.74,z);support.rotation.x=z>0?.16:-.16;
  const body=new THREE.Mesh(new THREE.BoxGeometry(.11,1.39,.13),bodyMaterial);
  body.name='desk-leg-body';body.castShadow=true;body.receiveShadow=true;support.add(body);
  if(z>0){
    const led=new THREE.Mesh(new THREE.BoxGeometry(.05,.52,.012),ledMaterial);
    led.name='desk-leg-led';
    // A 1mm gap avoids z-fighting while keeping the strip on the tilted face.
    led.position.set(0,-.13,.072);support.add(led);
  }
  return support;
}
