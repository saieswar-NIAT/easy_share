import React, { useState } from 'react';
import { MapPin, Navigation, Car, Clock, ShieldCheck, Layers, ChevronRight } from 'lucide-react';
import { RideGroup, RouteStop } from '../types';

interface InteractiveRouteMapProps {
  group: RideGroup;
  onSelectStop?: (stop: RouteStop) => void;
  className?: string;
}

export const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  group,
  onSelectStop,
  className = ''
}) => {
  const [selectedStopId, setSelectedStopId] = useState<string>(group.stops[1]?.id || group.stops[0]?.id || '');
  const [mapMode, setMapMode] = useState<'route' | 'pickup'>('route');

  const selectedStop = group.stops.find((s) => s.id === selectedStopId) || group.stops[0];

  // Map coordinates calculation for SVG rendering
  // Origin is at bottom-left (airport), sequential stops move northeast towards downtown
  const mapPoints = group.stops.map((stop, index) => {
    if (stop.isAirportOrigin) {
      return { x: 50, y: 160, stop };
    }
    // Interpolate sequential points smoothly along a realistic northeast trajectory
    const totalStops = Math.max(1, group.stops.length - 1);
    const progress = index / totalStops;
    const x = 50 + progress * 240 + (index % 2 === 0 ? 15 : -10);
    const y = 160 - progress * 115 - (index * 8);
    return { x, y, stop };
  });

  // Polyline coordinates string
  const polylinePoints = mapPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className={`bg-slate-900 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-md ${className}`}>
      
      {/* Map Header Toolbar */}
      <div className="px-4 py-2.5 bg-slate-950/80 backdrop-blur-xs border-b border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="font-semibold text-slate-200">
            {mapMode === 'route' ? 'Optimal Highway Route' : 'Airport Curbside Pickup Island'}
          </span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-400 font-mono">
            {group.stops.length - 1} Drop-off{group.stops.length - 1 > 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-lg border border-slate-700/50">
          <button
            onClick={() => setMapMode('route')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              mapMode === 'route' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Highway Route
          </button>
          <button
            onClick={() => setMapMode('pickup')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              mapMode === 'pickup' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pickup Zone
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden select-none">
        
        {mapMode === 'route' ? (
          <>
            {/* Background Grid & Bay Area Estuary styling */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#007aff" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#ff9500" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="bayWater" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.12" />
                </linearGradient>

                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Waterway / Bay curve contour */}
              <path
                d="M 120 220 C 180 180, 220 110, 360 40 L 360 0 L 0 0 L 0 220 Z"
                fill="url(#bayWater)"
              />

              {/* US-101 / Highway Ghost Path */}
              <path
                d="M 40 180 Q 150 140 220 80 T 320 25"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                strokeLinecap="round"
              />

              {/* Active Route Glow & Polyline */}
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="#007aff"
                strokeWidth="6"
                strokeOpacity="0.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 2"
              />

              {/* Vehicle Indicator along the route */}
              <circle cx="110" cy="132" r="5" fill="#ffffff" stroke="#007aff" strokeWidth="2.5" />
              <circle cx="110" cy="132" r="10" fill="#007aff" fillOpacity="0.2" className="animate-ping" />
            </svg>

            {/* Interactive Stop Pins overlaid */}
            <div className="absolute inset-0 pointer-events-auto">
              {mapPoints.map(({ x, y, stop }, idx) => {
                const isSelected = selectedStop?.id === stop.id;
                const isOrigin = stop.isAirportOrigin;

                return (
                  <button
                    key={stop.id}
                    onClick={() => {
                      setSelectedStopId(stop.id);
                      if (onSelectStop) onSelectStop(stop);
                    }}
                    style={{ left: `${(x / 330) * 100}%`, top: `${(y / 190) * 100}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform ${
                      isSelected ? 'scale-115 z-20' : 'scale-90 hover:scale-105 z-10'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      {/* Badge / Pill indicator */}
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 border transition-all ${
                          isOrigin
                            ? 'bg-blue-600 text-white border-blue-400'
                            : isSelected
                            ? 'bg-amber-500 text-slate-950 border-white font-extrabold ring-2 ring-amber-400/50'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        {isOrigin ? (
                          <>
                            <Navigation className="w-2.5 h-2.5" />
                            <span>Pickup</span>
                          </>
                        ) : (
                          <>
                            <span className="font-mono">#{idx}</span>
                            <span>{stop.passengerName.split(' ')[0]}</span>
                          </>
                        )}
                      </div>

                      {/* Pin arrow point */}
                      <div
                        className={`w-1.5 h-2 border-l-[3px] border-r-[3px] border-t-[5px] border-l-transparent border-r-transparent ${
                          isOrigin ? 'border-t-blue-500' : isSelected ? 'border-t-amber-500' : 'border-t-slate-700'
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          /* Airport Curbside Pickup Zone Schematic */
          <div className="p-4 h-full flex flex-col justify-between relative bg-slate-950">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Terminal 2 · Level 2 Departures / Rideshare Island
              </span>
              <span className="font-mono text-[11px] text-amber-400">Island 3 · Pillar 2B</span>
            </div>

            {/* Island diagram */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 my-auto">
              <div className="flex items-center justify-between gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-slate-800/90 text-slate-300 flex-1 border border-slate-700/50">
                  <div className="text-[10px] text-slate-500">Pillar 2A</div>
                  <div className="font-medium text-[11px]">Lyft Pickup</div>
                </div>
                <div className="p-2 rounded-lg bg-blue-950/80 border-2 border-blue-500 text-white flex-1 relative shadow-lg">
                  <div className="text-[10px] text-blue-300 font-bold uppercase">Pillar 2B</div>
                  <div className="font-bold text-xs text-amber-400">easy_share Spot</div>
                  <span className="absolute -top-1.5 right-1 px-1 rounded bg-amber-500 text-slate-950 text-[9px] font-bold">HERE</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/90 text-slate-300 flex-1 border border-slate-700/50">
                  <div className="text-[10px] text-slate-500">Pillar 2C</div>
                  <div className="font-medium text-[11px]">Taxi Stand</div>
                </div>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 text-center">
                Exit Doors 2D or 2E → Cross pedestrian skywalk → Island 3
              </div>
            </div>

            <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono">
              <span>GPS: 37.6189° N, 122.3750° W</span>
              <span className="text-emerald-400">Sheltered & Heated Island</span>
            </div>
          </div>
        )}

      </div>

      {/* Selected Stop Details Footer */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold font-mono text-[11px]">
            {selectedStop?.isAirportOrigin ? '0' : selectedStop?.stopIndex}
          </div>
          <div className="truncate">
            <div className="font-semibold text-slate-200 truncate flex items-center gap-1.5">
              <span>{selectedStop?.passengerName}</span>
              <span className="text-[10px] text-slate-500 font-normal">({selectedStop?.zoneName})</span>
            </div>
            <div className="text-[11px] text-slate-400 truncate font-mono">
              {selectedStop?.address}
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-[11px] font-semibold text-amber-400 font-mono">
            {selectedStop?.isAirportOrigin ? 'Start' : `+${selectedStop?.estimatedArrivalMin} min`}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            {selectedStop?.distanceFromAirportMiles} mi from SFO
          </div>
        </div>
      </div>

    </div>
  );
};
