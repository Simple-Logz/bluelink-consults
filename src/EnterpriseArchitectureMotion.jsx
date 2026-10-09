import React, { useId, useState } from 'react';

// Original vector artwork: four operating layers, with motion in CSS rather than a video download.
export default function EnterpriseArchitectureMotion() {
  const id = useId().replace(/:/g, '');
  const [playing, setPlaying] = useState(true);
  const ref = name => `url(#${id}-${name})`;
  const plate = (y, accent = false) => <g>
    <polygon points={`126,${y+12} 300,${y-77} 474,${y+12} 300,${y+101}`} fill="#cad8e6" opacity=".24" filter={ref('shadow')} />
    <polygon points={`126,${y} 300,${y+89} 300,${y+101} 126,${y+12}`} fill={ref('edge')} />
    <polygon points={`300,${y+89} 474,${y} 474,${y+12} 300,${y+101}`} fill={accent ? '#d69a9e' : '#a9c3db'} />
    <polygon points={`126,${y} 300,${y-89} 474,${y} 300,${y+89}`} fill={ref(accent ? 'redGlass' : 'glass')} stroke={accent ? '#dfabb0' : '#bed1e3'} strokeWidth="1.3" />
    <path d={`M138 ${y} L300 ${y-82} L462 ${y}`} fill="none" stroke="#fff" strokeWidth="2" opacity=".9" />
  </g>;
  const label = (y, title, caption, number) => <g className="architecture-label">
    <path d={`M482 ${y+5} H519`} fill="none" stroke="#b9c6d2" strokeWidth="1" />
    <text x="535" y={y-7} className="architecture-label-number">{number}</text>
    <text x="535" y={y+17} className="architecture-label-title">{title}</text>
    <text x="535" y={y+39} className="architecture-label-caption">{caption}</text>
  </g>;

  return <div className={`bl-architecture-motion ${playing ? '' : 'is-paused'}`}>
    <svg viewBox="0 0 790 785" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
      <title id={`${id}-title`}>Connected enterprise architecture</title>
      <desc id={`${id}-desc`}>An animated isometric illustration connects cloud infrastructure, security and identity, APIs and integration, and applications and AI.</desc>
      <defs>
        <linearGradient id={`${id}-glass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset=".52" stopColor="#eaf3fb" /><stop offset="1" stopColor="#d0e4f5" /></linearGradient>
        <linearGradient id={`${id}-redGlass`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" /><stop offset=".6" stopColor="#f9e8e9" /><stop offset="1" stopColor="#edc8cb" /></linearGradient>
        <linearGradient id={`${id}-edge`}><stop stopColor="#e2edf7" /><stop offset="1" stopColor="#b4cce1" /></linearGradient>
        <linearGradient id={`${id}-metal`}><stop stopColor="#fff" /><stop offset=".55" stopColor="#d7e8f6" /><stop offset="1" stopColor="#a9c5dd" /></linearGradient>
        <linearGradient id={`${id}-processor`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#173d69" /><stop offset=".52" stopColor="#3164a1" /><stop offset="1" stopColor="#b52220" /></linearGradient>
        <radialGradient id={`${id}-floor`}><stop stopColor="#c9dced" stopOpacity=".55" /><stop offset="1" stopColor="#eff5fa" stopOpacity="0" /></radialGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-50%" width="160%" height="200%"><feGaussianBlur stdDeviation="7" /></filter>
        <g id={`${id}-server`}>
          <polygon points="0,-73 25,-86 50,-73 25,-60" fill="#fff" stroke="#c6d9e8" />
          <polygon points="0,-73 25,-60 25,17 0,4" fill={ref('metal')} />
          <polygon points="25,-60 50,-73 50,4 25,17" fill="#94b4d1" />
          {[0,1,2,3,4].map(n => <g key={n}><path d={`M6 ${-58+n*13} l13 7`} stroke="#9db7ce" strokeWidth="2" /><circle cx="18" cy={-48+n*13} r="1.5" fill="#3978c0" className="architecture-server-light" style={{animationDelay:`${n*.4}s`}} /></g>)}
        </g>
        <g id={`${id}-database`}>
          <path d="M-23 -40 V3 C-23 18 23 18 23 3 V-40" fill={ref('metal')} stroke="#b9cfe1" />
          <ellipse cy="-40" rx="23" ry="11" fill="#fff" stroke="#bad0e2" />
          <path d="M-23 -19 C-23 -4 23 -4 23 -19 M-23 -4 C-23 11 23 11 23 -4" fill="none" stroke="#7eacce" strokeWidth="2" />
        </g>
      </defs>
      <ellipse cx="305" cy="727" rx="260" ry="43" fill={ref('floor')} />
      <g className="architecture-spine">
        <path d="M100 145 V656" stroke="#dae6f0" strokeWidth="18" />
        <path d="M106 145 V656" stroke="#acc6dd" strokeWidth="2" />
        <path d="M106 656 V145" stroke="#3073b5" strokeWidth="2" strokeDasharray="12 44" className="architecture-flow" />
        {[170,330,490,650].map(y => <g key={y}><path d={`M106 ${y} H127`} stroke="#a3c0d9" strokeWidth="2" /><circle cx="106" cy={y} r="4" fill="#fff" stroke="#5088ba" /></g>)}
      </g>
      <g className="architecture-stage architecture-stage-cloud">
        {plate(650)}
        <use href={`#${id}-server`} transform="translate(211 611)" />
        <use href={`#${id}-server`} transform="translate(278 644)" />
        <use href={`#${id}-server`} transform="translate(342 610)" />
        <path d="M184 660 L300 719 L421 657" fill="none" stroke="#6da4d0" strokeWidth="2" opacity=".8" />
        {label(650,'Cloud infrastructure','A dependable operating foundation','01')}
      </g>
      <g className="architecture-stage architecture-stage-security">
        {plate(490)}
        <g transform="translate(294 458)">
          <polygon points="-57,16 0,-14 57,16 0,46" fill="#a8c6df" opacity=".3" />
          <path d="M-22 -4 V-27 C-22 -57 22 -57 22 -27 V-4" fill="none" stroke="#b5ccdf" strokeWidth="11" />
          <path d="M-21 -4 V-26 C-21 -54 21 -54 21 -26" fill="none" stroke="#fff" strokeWidth="4" />
          <polygon points="-35,-7 21,-20 42,-8 -14,6" fill="#fff" stroke="#b9cede" />
          <polygon points="-35,-7 -14,6 -14,51 -35,39" fill="#b5cfe3" />
          <polygon points="-14,6 42,-8 42,37 -14,51" fill={ref('metal')} />
          <ellipse cx="13" cy="19" rx="5" ry="7" fill="#346396" /><path d="M13 24 V34" stroke="#346396" strokeWidth="4" />
        </g>
        <path d="M183 493 L231 516 L261 501 M336 501 L367 516 L416 491" stroke="#799dbd" strokeWidth="1.5" fill="none" />
        {label(490,'Security & identity','Access, protection and control','02')}
      </g>
      <g className="architecture-stage architecture-stage-integration">
        {plate(330)}
        <path d="M194 336 L246 311 L301 339 L353 311 L411 340 M246 311 V282 M301 339 V370 M353 311 V282" fill="none" stroke="#70a2cb" strokeWidth="3" />
        <path d="M194 336 L246 311 L301 339 L353 311 L411 340" fill="none" stroke="#b52220" strokeWidth="2" strokeDasharray="8 90" className="architecture-flow" />
        {[{x:227,y:292},{x:282,y:320},{x:337,y:292}].map(({x,y},n) => <g key={x} transform={`translate(${x} ${y})`}><polygon points="0,-25 19,-35 38,-25 19,-15" fill="#fff" stroke="#bfd3e3" /><polygon points="0,-25 19,-15 19,13 0,3" fill="#bdd5e8" /><polygon points="19,-15 38,-25 38,3 19,13" fill="#91b6d5" /><circle cx="28" cy="-10" r="2" fill="#3470ae" className="architecture-server-light" style={{animationDelay:`${n}s`}} /></g>)}
        {label(330,'APIs & integration','Systems that work together','03')}
      </g>
      <g className="architecture-stage architecture-stage-applications">
        {plate(170,true)}
        <g transform="translate(248 160)">
          <polygon points="-26,-8 14,-28 45,-12 5,8" fill="#a7bfd4" opacity=".4" />
          <polygon points="-27,-61 28,-33 28,7 -27,-21" fill="#c5dcec" stroke="#aac6db" />
          <polygon points="-23,-55 23,-31 23,0 -23,-24" fill="#fff" />
          <path d="M-17 -42 l12 6 M-17 -31 l31 16 M3 -30 l12 6" stroke="#457db4" strokeWidth="3" />
        </g>
        <use href={`#${id}-database`} transform="translate(350 155)" />
        <g transform="translate(296 205)">
          <path d="M-52 0 L0 -26 L52 0 L0 26 Z" fill="#fff" stroke="#d9abb0" />
          <path d="M-37 0 L0 -19 L37 0 L0 19 Z" fill={ref('processor')} className="architecture-processor" />
          <path d="M-15 0 L0 -8 L15 0 L0 8 Z" fill="#fff" opacity=".7" />
        </g>
        {label(170,'Applications & AI','Useful capabilities, governed use','04')}
      </g>
    </svg>
    <ol className="architecture-mobile-legend"><li>Cloud infrastructure</li><li>Security &amp; identity</li><li>APIs &amp; integration</li><li>Applications &amp; AI</li></ol>
    <button type="button" className="architecture-motion-toggle" onClick={() => setPlaying(value => !value)} aria-label={playing ? 'Pause architecture animation' : 'Play architecture animation'}>{playing ? 'Pause animation' : 'Play animation'}</button>
  </div>;
}
