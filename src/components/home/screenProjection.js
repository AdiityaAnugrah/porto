export function screenTransform(points, width = 768, height = 448) {
  const [p0,p1,p2,p3] = points;
  const dx1=p1.x-p2.x, dx2=p3.x-p2.x, dx3=p0.x-p1.x+p2.x-p3.x;
  const dy1=p1.y-p2.y, dy2=p3.y-p2.y, dy3=p0.y-p1.y+p2.y-p3.y;
  const determinant=dx1*dy2-dx2*dy1;
  if (Math.abs(determinant)<1e-8) return null;
  const g=(dx3*dy2-dx2*dy3)/determinant, h=(dx1*dy3-dx3*dy1)/determinant;
  const a=p1.x-p0.x+g*p1.x, b=p3.x-p0.x+h*p3.x;
  const d=p1.y-p0.y+g*p1.y, e=p3.y-p0.y+h*p3.y;
  return [a/width,d/width,0,g/width,b/height,e/height,0,h/height,0,0,1,0,p0.x,p0.y,0,1];
}
