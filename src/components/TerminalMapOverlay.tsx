import React, { useState } from 'react';
import { X, Navigation, MapPin, Footprints, Clock, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { UserProfile, GroupMember } from '../types';

interface TerminalMapOverlayProps {
  currentUser: UserProfile;
  members: GroupMember[];
  onClose: () => void;
  targetUser?: UserProfile | null;
}

export const TerminalMapOverlay: React.FC<TerminalMapOverlayProps> = ({
  currentUser,
  members,
  onClose,
  targetUser
}) => {
  const [activeFloor, setActiveFloor] = useState<'level_1' | 'level_2'>('level_1');
  const [selectedPassengerId, setSelectedPassengerId] = useState<string>(
    targetUser?.id || members[0]?.user.id || currentUser.id
  );

  // Check if someone matches the current user's carousel
  const carouselBuddy = members.find(
    (m) => m.user.id !== currentUser.id && m.user.baggageCarousel === currentUser.baggageCarousel
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                SFO Terminal 2 Indoor Passenger Navigation
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live terminal positions, baggage carousels & rideshare pickup route
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Level Switcher & Carousel Match Alert */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveFloor('level_1')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFloor === 'level_1'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Level 1 · Baggage Claim & Arrival
            </button>
            <button
              onClick={() => setActiveFloor('level_2')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFloor === 'level_2'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Level 2 · Rideshare Island (Pillars 2A-2C)
            </button>
          </div>

          {carouselBuddy && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>
                <strong>Baggage Meetup:</strong> You and {carouselBuddy.user.name} are both assigned to{' '}
                <span className="font-bold underline">{currentUser.baggageCarousel}</span>!
              </span>
            </div>
          )}
        </div>

        {/* Main Content: Map Blueprint + Passenger Sidebar */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          
          {/* Blueprint SVG Canvas */}
          <div className="lg:col-span-2 p-4 bg-slate-900 flex flex-col justify-between relative min-h-[320px]">
            
            {/* Terminal Map Schematic */}
            <div className="relative w-full h-72 sm:h-80 bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-hidden select-none">
              
              {activeFloor === 'level_1' ? (
                /* Level 1: Baggage Claim Area */
                <div className="relative w-full h-full">
                  <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Level 1 · Baggage Claim Hall
                  </div>

                  {/* Terminal Boundary Schematic */}
                  <div className="absolute inset-4 border border-dashed border-slate-700/60 rounded-xl pointer-events-none" />

                  {/* Carousels layout */}
                  <div className="absolute inset-x-8 top-12 bottom-12 grid grid-cols-3 gap-4">
                    {['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4', 'Carousel 5', 'Carousel 6'].map((carousel, idx) => {
                      const isMyCarousel = currentUser.baggageCarousel === carousel;
                      const hasSarah = carousel === 'Carousel 4';
                      const hasMarcus = carousel === 'Carousel 2';

                      return (
                        <div
                          key={carousel}
                          className={`rounded-xl border p-2 flex flex-col justify-between transition-all ${
                            isMyCarousel
                              ? 'bg-blue-950/40 border-blue-500/80 shadow-md ring-1 ring-blue-500/30'
                              : 'bg-slate-900/60 border-slate-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className={`font-mono font-bold ${isMyCarousel ? 'text-blue-400' : 'text-slate-400'}`}>
                              {carousel}
                            </span>
                            {isMyCarousel && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500 text-white font-bold">
                                YOURS
                              </span>
                            )}
                          </div>

                          {/* Oval carousel conveyer graphic */}
                          <div className="h-10 my-1 rounded-full border-2 border-slate-700 flex items-center justify-center relative overflow-hidden bg-slate-950/50">
                            <div className="w-12 h-3 rounded-full bg-slate-800/80 border border-slate-700"></div>
                            
                            {/* Luggage icon animation */}
                            <div className="absolute w-2 h-2 rounded-xs bg-amber-500"></div>
                          </div>

                          {/* Passenger markers present */}
                          <div className="flex items-center gap-1 min-h-[20px]">
                            {hasSarah && (
                              <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                <span>Sarah</span>
                              </div>
                            )}
                            {isMyCarousel && (
                              <div className="flex items-center gap-1 bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                <span>You</span>
                              </div>
                            )}
                            {hasMarcus && (
                              <div className="flex items-center gap-1 bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                                <span>Marcus</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Escalator indicator to Level 2 */}
                  <div className="absolute bottom-2 right-6 flex items-center gap-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-800/60">
                    <Footprints className="w-3 h-3" />
                    <span>Escalators to Level 2 Rideshare ↑</span>
                  </div>
                </div>
              ) : (
                /* Level 2: Departures & Rideshare Island */
                <div className="relative w-full h-full flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    <span>Level 2 · Outer Courtyard Rideshare Island</span>
                    <span className="text-amber-400 font-bold">Island 3 · Pillar 2B</span>
                  </div>

                  {/* Curbside & Pillars graphic */}
                  <div className="my-auto space-y-4">
                    {/* Skywalk Pedestrian Bridge */}
                    <div className="h-6 bg-slate-800/80 rounded-md border border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                      ← Covered Skybridge from Terminal 2 & Terminal 1 Baggage Hall →
                    </div>

                    {/* Island 3 with Pillars */}
                    <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-3">
                      <div className="text-[10px] text-slate-400 font-bold uppercase mb-2">
                        Rideshare Island 3 (Uber / Lyft / Easy_Share)
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                          <div className="font-mono text-slate-400 text-[10px]">Zone 2A</div>
                          <div className="font-semibold text-[11px] mt-0.5">Lyft Pickup</div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-blue-900/60 border-2 border-blue-400 text-white relative shadow-md">
                          <div className="font-mono text-blue-300 text-[10px] font-bold">Zone 2B</div>
                          <div className="font-bold text-amber-400 text-xs">easy_share Meeting Spot</div>
                          <span className="text-[9px] text-blue-200 block font-mono">Toyota Highlander XL</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                          <div className="font-mono text-slate-400 text-[10px]">Zone 2C</div>
                          <div className="font-semibold text-[11px] mt-0.5">Taxi Stand</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Vehicle: Uber XL (Carlos M. · Plate 8TYP902)</span>
                    <span className="text-amber-400 font-bold">Driver Arriving in ~8 mins</span>
                  </div>
                </div>
              )}

            </div>

            {/* Walking instruction bar */}
            <div className="mt-3 bg-slate-950/80 rounded-xl p-3 border border-slate-800 text-xs text-slate-300 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-semibold text-white">Suggested Meetup Walkway</div>
                <div className="text-[11px] text-slate-400 truncate">
                  Meet Sarah at Carousel 4 Column B → take center elevator to Level 2 → Island 3 Pillar 2B (2 min walk).
                </div>
              </div>
            </div>

          </div>

          {/* Passenger Relative Locations Sidebar */}
          <div className="p-5 flex flex-col justify-between bg-white">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                Riders in Group ({members.length})
              </h4>

              <div className="space-y-3">
                {/* You */}
                <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-blue-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {currentUser.name} <span className="text-[10px] text-blue-600 font-normal">(You)</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {currentUser.flightNumber} · {currentUser.baggageCarousel}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      At Baggage
                    </span>
                  </div>
                </div>

                {/* Other Members */}
                {members.filter(m => m.user.id !== currentUser.id).map((member) => {
                  const isBuddy = member.user.baggageCarousel === currentUser.baggageCarousel;

                  return (
                    <div
                      key={member.user.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isBuddy
                          ? 'border-amber-300 bg-amber-50/60 shadow-2xs'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={member.user.avatar}
                            alt={member.user.name}
                            referrerPolicy="no-referrer"
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{member.user.name}</span>
                              {isBuddy && (
                                <span className="text-[9px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-bold">
                                  SAME CAROUSEL
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {member.user.flightNumber} · {member.user.baggageCarousel}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {member.user.status === 'baggage_claim' ? 'At Carousel' : member.user.status === 'walking_to_pickup' ? 'En Route' : 'At Pillar'}
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                        <span className="flex items-center gap-1">
                          <Footprints className="w-3 h-3 text-slate-400" />
                          {isBuddy ? '~20 feet away' : '3 min walking distance'}
                        </span>
                        <span className="font-semibold text-blue-600">
                          {isBuddy ? 'Meet at Carousel 4' : 'Meet at Pillar 2B'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Return to Ride Chat
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
