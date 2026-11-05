import { memo, useId } from 'react';
import { useActiveLocale } from '../../lib/i18n';
import './workstation.css';

const project = ([x, y, z]) => [410 + (x - y) * 0.9, 400 + (x + y) * 0.43 - z];
const points = vertices => vertices.map(vertex => project(vertex).map(value => value.toFixed(2)).join(',')).join(' ');
const materials = {
  wood: { top: '#946653', front: '#684437', side: '#4d322d' },
  metal: { top: '#5e5a62', front: '#39353e', side: '#242129' },
  dark: { top: '#36313a', front: '#242028', side: '#17151c' },
  ivory: { top: '#f0e4d8', front: '#c7b5a9', side: '#9d8b82' },
  accent: { top: '#e0a18b', front: '#ad6755', side: '#864a40' },
};

function Block({ x, y, w, d, z, h, material = 'metal', part }) {
  const color = materials[material];
  return <g data-part={part} stroke="#17121a" strokeOpacity=".36" strokeWidth=".65" strokeLinejoin="round">
    <polygon points={points([[x + w,y,z],[x + w,y + d,z],[x + w,y + d,z + h],[x + w,y,z + h]])} fill={color.side}/>
    <polygon points={points([[x,y + d,z],[x + w,y + d,z],[x + w,y + d,z + h],[x,y + d,z + h]])} fill={color.front}/>
    <polygon points={points([[x,y,z + h],[x + w,y,z + h],[x + w,y + d,z + h],[x,y + d,z + h]])} fill={color.top}/>
  </g>;
}

function Prism({ outline, z, h, material = 'metal', part }) {
  const color = materials[material];
  return <g data-part={part} stroke="#17121a" strokeOpacity=".3" strokeWidth=".65" strokeLinejoin="round">
    {outline.map(([x,y], i) => {
      const [nextX,nextY] = outline[(i + 1) % outline.length];
      if ((nextY - y) - (nextX - x) <= 0) return null;
      return <polygon key={i} points={points([[x,y,z],[nextX,nextY,z],[nextX,nextY,z + h],[x,y,z + h]])} fill={nextY - y > -(nextX - x) ? color.side : color.front}/>;
    })}
    <polygon points={points(outline.map(([x,y]) => [x,y,z + h]))} fill={color.top}/>
  </g>;
}

function Disc({ x, y, r, z, h, material = 'dark', part }) {
  const outline = Array.from({ length: 18 }, (_, i) => [x + Math.cos(i * Math.PI / 9) * r, y + Math.sin(i * Math.PI / 9) * r]);
  return <Prism outline={outline} z={z} h={h} material={material} part={part}/>;
}

function Front({ x, y, z, children }) {
  const [left,top] = project([x,y,z]);
  return <g transform={`matrix(.9 .43 0 1 ${left} ${top})`}>{children}</g>;
}

const keyboard = Array.from({ length: 4 }, (_, row) => Array.from({ length: 12 }, (_, column) => ({ x: -103 + column * 10.1 + row * .45, y: 7 + row * 10, accent: (row === 0 && column === 0) || (row === 1 && column === 2) || (row === 2 && column > 0 && column < 4) }))).flat();
const controllerOutline = [[-40,-12],[-25,-20],[-10,-14],[10,-14],[25,-20],[40,-12],[45,9],[38,22],[24,20],[13,10],[-13,10],[-24,20],[-38,22],[-45,9]].map(([x,y]) => [x - 70,y + 82]);

const WorkstationDrawing = memo(function WorkstationDrawing({ gaming, powerState, titleId, descriptionId, id }) {
  return <svg className="workstation-svg" viewBox="90 0 640 550" role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
    <title id={titleId}>{id ? 'Ilustrasi isometrik meja developer dan gaming' : 'Isometric developer and gaming desk illustration'}</title>
    <desc id={descriptionId}>{id ? 'Monitor, komputer, keyboard mekanik, mouse, speaker, dan controller di atas meja kayu. Pilihan mode mengubah isi monitor, bukan status akun gaming.' : 'A monitor, computer, mechanical keyboard, mouse, speakers, and controller on a wooden desk. Mode selection changes the illustrated display, not a gaming account status.'}</desc>
    <ellipse cx="407" cy="425" rx="239" ry="79" fill="#100d12" opacity=".28"/>
    {[[ -165,-91 ],[151,-91],[-165,89],[151,89]].map(([x,y]) => <g key={`${x}-${y}`}><Block x={x - 3} y={y - 3} w={18} d={18} z={0} h={5} material="dark" part="desk-foot"/><Block x={x} y={y} w={12} d={12} z={5} h={135} part="desk-leg"/></g>)}
    <Block x={-165} y={-91} w={328} d={8} z={115} h={18} material="dark" part="rear-brace"/>
    <Block x={-184} y={-108} w={368} d={220} z={140} h={11} material="wood" part="desktop"/>
    <polyline points={points([[-171,104,151],[174,104,151]])} fill="none" stroke="#bc8b6c" strokeWidth="1" opacity=".6"/>
    <Block x={-126} y={-9} w={224} d={81} z={151} h={1} material="dark" part="desk-mat"/>
    <path d={`M${project([-18,1,156]).join(',')} Q${project([-2,-32,153]).join(',')} ${project([-25,-59,158]).join(',')}`} fill="none" stroke="#1c1921" strokeWidth="2.3" strokeLinecap="round"/>
    <path d={`M${project([66,14,157]).join(',')} Q${project([82,-6,153]).join(',')} ${project([99,-11,158]).join(',')}`} fill="none" stroke="#29242d" strokeWidth="2.2" strokeLinecap="round"/>
    <Block x={-158} y={-58} w={30} d={26} z={151} h={55} material="dark" part="left-speaker"/>
    <Front x={-155} y={-31.6} z={202}><circle cx="12" cy="18" r="10" fill="#131118" stroke="#80717a" strokeWidth="1.3"/><circle cx="12" cy="18" r="5" fill="#51434d"/><rect x="5" y="37" width="14" height="3" rx="1.5" fill="#b77c6a"/></Front>
    <Block x={-62} y={-75} w={66} d={43} z={151} h={5} part="monitor-base"/>
    <Block x={-35} y={-62} w={13} d={12} z={156} h={49} part="monitor-stand"/>
    <Block x={-106} y={-70} w={154} d={18} z={204} h={113} material="dark" part="monitor-case"/>
    <Front x={-100} y={-51.5} z={311}>
      <rect width="142" height="101" rx="3" fill="#72646e"/>
      <rect x="2" y="2" width="138" height="94" rx="2" fill={gaming ? '#242532' : '#efe7df'}/>
      {gaming ? <g className="workstation-screen-play">
        <path d="M3 70 70 32 139 70M3 85 70 47 139 85M34 94 70 47 109 94" fill="none" stroke="#65555f" strokeWidth=".8"/>
        <path d="M45 36Q47 26 57 29L65 33H80L88 29Q98 26 101 36L106 54Q107 63 99 64L88 54H58L47 64Q38 63 39 55Z" fill="#dfc3b3" stroke="#f7e7db" strokeWidth="1"/>
        <path d="M53 36v14m-7-7h14" stroke="#49404b" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="92" cy="39" r="2.5" fill="#b66c59"/><circle cx="97" cy="45" r="2.5" fill="#b66c59"/>
        <text x="71" y="83" textAnchor="middle" fontSize="7" fill="#f2ddd0" fontFamily="Inter, sans-serif">PLAY MODE</text>
      </g> : <g className="workstation-screen-work">
        <path d="M3 18H139" stroke="#d6c5b8" strokeWidth=".8"/>
        <text x="10" y="13" fontSize="6.5" fill="#44343b" fontFamily="Inter, sans-serif">Aditya Anugrah</text>
        <rect x="10" y="28" width="38" height="49" rx="2" fill="#b48771"/>
        <path d="m13 69 13-17 10 10 9-13v25H13Z" fill="#7b5349"/>
        <text x="57" y="38" fontSize="10" fill="#332630" fontFamily="Inter, sans-serif">Digital</text>
        <text x="57" y="50" fontSize="10" fill="#332630" fontFamily="Inter, sans-serif">products.</text>
        <path d="M58 59h62m-62 6h49" stroke="#baa395" strokeWidth="2" strokeLinecap="round"/>
        <rect x="57" y="74" width="48" height="10" rx="2" fill="#5c3733"/>
        <path d="M65 79h29" stroke="#f0dfd0" strokeWidth="1.3" strokeLinecap="round"/>
      </g>}
      {powerState!=='on'&&<g data-poster-power={powerState}><rect x="2" y="2" width="138" height="94" rx="2" fill="#020507"/>{powerState!=='off'&&<><text x="71" y="49" textAnchor="middle" fontSize="9" fill="#e4edf3" fontFamily="Inter, sans-serif">{id?(powerState==='booting'?'Menyalakan PC':'Mematikan PC'):(powerState==='booting'?'Starting PC':'Shutting down')}</text><path d="M35 64h72" stroke="#83bfcf" strokeWidth="1.5"/></>}</g>}
      <circle cx="135" cy="99" r="1.1" fill="#e0a18b"/>
    </Front>
    <Block x={57} y={-70} w={25} d={24} z={151} h={47} material="dark" part="right-speaker"/>
    <Front x={59} y={-45.7} z={195}><circle cx="10" cy="16" r="8" fill="#131118" stroke="#80717a" strokeWidth="1"/><circle cx="10" cy="16" r="4" fill="#51434d"/><rect x="5" y="32" width="10" height="2" rx="1" fill="#b77c6a"/></Front>
    <Block x={91} y={-85} w={64} d={75} z={151} h={129} material="dark" part="computer-tower"/>
    <Front x={94} y={-9.6} z={277}>
      <rect width="58" height="121" rx="3" fill="#2e2932" stroke="#74636d" strokeWidth=".8"/>
      {[32,83].map(y => <g key={y}><circle cx="29" cy={y} r="21" fill="#18151e" stroke="#bd8a77" strokeWidth="1.4"/>{[0,90,180,270].map(angle => <path key={angle} d={`M29 ${y}q-17-18-7-16 16 1 7 16`} fill="#57444e" transform={`rotate(${angle} 29 ${y})`}/>)}<circle cx="29" cy={y} r="4" fill="#a57969"/></g>)}
      <rect x="10" y="111" width="27" height="2" rx="1" fill="#6d5864"/><circle cx="46" cy="112" r="2" fill="#e0a18b"/>
    </Front>
    <g transform={`matrix(-.9 .43 0 1 ${project([155.4,-78,271]).join(' ')})`}>
      <rect width="61" height="108" rx="2" fill="#28232c" stroke="#79636f" strokeWidth="1"/>
      <rect x="7" y="10" width="47" height="85" rx="1" fill="#37303b"/>
      <circle cx="31" cy="36" r="18" fill="#153347" stroke="#8fcad4" strokeWidth="1.3"/><path d="M17 51q3-14 14-14t14 14" fill="#27334c"/><ellipse cx="31" cy="34" rx="9" ry="12" fill="#f2ceba"/><path d="M21 37q-5-19 11-18t9 19l-5-10-5 9-4-8-5 10Z" fill="#dce8ee"/><path d="M25 35h4m5 0h4" stroke="#68538c" strokeWidth="2"/>
      {(powerState==='off'||powerState==='booting')&&<circle cx="31" cy="36" r="18" fill="#000"/>}
      {[14,19,24].map(x => <rect key={x} x={x} y="65" width="31" height="2.5" rx="1" fill="#806559"/>)}
      <rect x="9" y="68" width="43" height="13" rx="2" fill="#161d25"/><text x="13" y="77" fill="#b4de8c" fontSize="6" fontFamily="Inter, sans-serif">GEFORCE RTX</text>
      <path d="M9 18v72h39M46 14v46h-7" fill="none" stroke="#8b716d" strokeWidth="1.2"/>
      {[[3,3],[58,3],[3,104],[58,104]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#baa290"/>)}
    </g>
    <Block x={-112} y={0} w={137} d={60} z={152} h={4} part="keyboard-case"/>
    {keyboard.map((key,index) => <Block key={index} x={key.x} y={key.y} w={8} d={7} z={156} h={2.6} material={key.accent ? 'accent' : 'ivory'} part="keycap"/>)}
    <Block x={-74} y={49} w={54} d={6} z={156} h={2.6} material="ivory" part="spacebar"/>
    {[-101,-89,0,12].map(x => <Block key={x} x={x} y={49} w={8} d={6} z={156} h={2.6} material="ivory" part="modifier-key"/>)}
    <Prism outline={[[56,15],[61,10],[69,10],[75,16],[76,37],[72,43],[59,43],[54,36]]} z={152} h={8} material="ivory" part="mouse"/>
    <polyline points={points([[65,13,160],[65,27,160]])} fill="none" stroke="#8b746a" strokeWidth=".8"/>
    <Block x={63.5} y={17} w={3} d={6} z={160} h={1.5} material="dark" part="mouse-wheel"/>
    <Prism outline={controllerOutline} z={151} h={10} material="ivory" part="controller"/>
    <Block x={-99} y={77} w={18} d={5} z={161} h={2.5} material="dark" part="dpad-horizontal"/>
    <Block x={-93} y={71} w={5} d={17} z={161} h={2.7} material="dark" part="dpad-vertical"/>
    {[[-81,91],[-59,91]].map(([x,y]) => <g key={x}><Disc x={x} y={y} r={7} z={161} h={2} part="stick-seat"/><Disc x={x} y={y} r={4.5} z={163} h={2.5} part="thumbstick"/></g>)}
    {[[-45,72],[-38,78],[-45,84],[-52,78]].map(([x,y]) => <Disc key={`${x}-${y}`} x={x} y={y} r={2.6} z={161} h={2.5} material="accent" part="controller-button"/>)}
    <Block x={-73} y={71} w={8} d={3} z={161} h={1} material="dark" part="controller-menu"/>
    <polyline points={points([[-171,-101,151],[-134,-101,151]])} fill="none" stroke="#c7967c" strokeWidth="1"/>
  </svg>;
});


export default function PcPoster({ gaming = false, powerState='on' }) { const token = useId(); const id = useActiveLocale() === 'id'; return <WorkstationDrawing gaming={gaming} powerState={powerState} titleId={token+'-title'} descriptionId={token+'-description'} id={id}/>; }
