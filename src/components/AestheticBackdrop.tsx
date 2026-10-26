import React from 'react';

export type BackgroundTheme = 'runway_twilight' | 'stratosphere' | 'night_grid';

interface AestheticBackdropProps {
  theme?: BackgroundTheme;
  intensity?: 'soft' | 'vibrant';
}

export const AestheticBackdrop: React.FC<AestheticBackdropProps> = ({
  theme = 'runway_twilight',
  intensity = 'soft'
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      
      {/* Dynamic Base Gradient */}
      {theme === 'runway_twilight' && (
        <div className="absolute inset-0 bg-slate-900 transition-colors duration-700">
          {/* Ambient luminous orbs */}
          <div className="absolute -top-[20%] left-[10%] w-[650px] h-[650px] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute top-[30%] -right-[10%] w-[550px] h-[550px] rounded-full bg-indigo-600/20 blur-[130px]" />
          <div className="absolute -bottom-[15%] left-[25%] w-[700px] h-[500px] rounded-full bg-amber-500/15 blur-[140px]" />
        </div>
      )}

      {theme === 'stratosphere' && (
        <div className="absolute inset-0 bg-slate-950 transition-colors duration-700">
          <div className="absolute -top-[15%] right-[15%] w-[700px] h-[700px] rounded-full bg-sky-500/25 blur-[130px]" />
          <div className="absolute top-[40%] -left-[10%] w-[600px] h-[600px] rounded-full bg-blue-700/20 blur-[140px]" />
          <div className="absolute bottom-[5%] right-[20%] w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[120px]" />
        </div>
      )}

      {theme === 'night_grid' && (
        <div className="absolute inset-0 bg-slate-950 transition-colors duration-700">
          <div className="absolute top-[10%] left-[30%] w-[600px] h-[600px] rounded-full bg-cyan-600/15 blur-[130px]" />
          <div className="absolute -bottom-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-indigo-700/20 blur-[120px]" />
          <div className="absolute top-[60%] right-[10%] w-[450px] h-[450px] rounded-full bg-amber-500/12 blur-[130px]" />
        </div>
      )}

      {/* SVG Aeronautical & Navigational Flight Vector Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="navGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="0.75" />
            <circle cx="60" cy="0" r="1.5" fill="#ffffff" opacity="0.6" />
          </pattern>

          <linearGradient id="flightVectorGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#007aff" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff9500" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Global Coordinate Grid */}
        <rect width="100%" height="100%" fill="url(#navGrid)" />

        {/* Great-Circle Flight Path Arcs */}
        <path
          d="M -100 400 Q 300 150 750 300 T 1600 100"
          fill="none"
          stroke="url(#flightVectorGrad)"
          strokeWidth="2.5"
          strokeDasharray="8 6"
        />
        <path
          d="M -50 700 Q 500 450 1100 550 T 1900 350"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          opacity="0.7"
        />

        {/* Radar / Compass Navigation Ring Geometry */}
        <g transform="translate(180, 220)">
          <circle cx="0" cy="0" r="110" fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="3 5" />
          <circle cx="0" cy="0" r="70" fill="none" stroke="#ffffff" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="#ffffff" strokeWidth="0.8" />
          <line x1="-120" y1="0" x2="120" y2="0" stroke="#ffffff" strokeWidth="0.8" />
          <line x1="0" y1="-120" x2="0" y2="120" stroke="#ffffff" strokeWidth="0.8" />
        </g>

        {/* Runway Approach Light Strip Geometry */}
        <g transform="translate(950, 480) rotate(-24)">
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1={i * 35}
              y1="-15"
              x2={i * 35}
              y2="15"
              stroke={i % 3 === 0 ? '#ff9500' : '#ffffff'}
              strokeWidth="1.5"
              opacity={0.8}
            />
          ))}
          <line x1="-20" y1="0" x2="440" y2="0" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 4" />
        </g>
      </svg>

      {/* Subtle Film Grain Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Horizon Soft Vignette Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
    </div>
  );
};
