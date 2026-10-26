import React, { useState } from 'react';
import { 
  Users, MapPin, Clock, ArrowRight, Plus, Filter, ShieldCheck, 
  Briefcase, Package, Car, Sparkles, CheckCircle2, ChevronRight, Search
} from 'lucide-react';
import { AirportInfo, DestinationZone, RideGroup, UserProfile } from '../types';
import { TrunkVisualizer } from './TrunkVisualizer';

interface DiscoveryHubProps {
  currentAirport: AirportInfo;
  destinationZones: DestinationZone[];
  groups: RideGroup[];
  currentUser: UserProfile;
  onSelectGroup: (group: RideGroup) => void;
  onJoinGroup: (group: RideGroup) => void;
  onOpenCreateRide: () => void;
  onOpenFlightSync: () => void;
  onOpenSecurityModal?: () => void;
}

export const DiscoveryHub: React.FC<DiscoveryHubProps> = ({
  currentAirport,
  destinationZones,
  groups,
  currentUser,
  onSelectGroup,
  onJoinGroup,
  onOpenCreateRide,
  onOpenFlightSync,
  onOpenSecurityModal
}) => {
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [vehicleFilter, setVehicleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter groups
  const filteredGroups = groups.filter((grp) => {
    if (grp.airportCode !== currentAirport.code) return false;
    if (selectedZoneFilter !== 'all' && grp.destinationZone !== selectedZoneFilter) return false;
    if (vehicleFilter !== 'all' && grp.vehicleType !== vehicleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = grp.title.toLowerCase().includes(q);
      const matchDest = grp.destinationZone.toLowerCase().includes(q);
      const matchAddress = grp.primaryAddress.toLowerCase().includes(q);
      if (!matchTitle && !matchDest && !matchAddress) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-24">
      
      {/* 1. Airport Arrival Status Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Live Matchmaking Hub · {currentAirport.city}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
            Landing at {currentAirport.name}
          </h1>

          <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Connect with passengers touching down now, share an Uber XL or taxi, and split fares directly to downtown hotels and convention hubs.
          </p>

          {/* User's Flight Status Card */}
          <div className="mt-4 pt-4 border-t border-blue-500/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <span className="text-blue-200 text-[10px] uppercase font-mono block">Your Verified Flight</span>
                <span className="font-bold text-sm font-mono text-white">{currentUser.flightNumber}</span>
                <span className="text-blue-200 text-[11px] ml-1.5">({currentUser.terminal})</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <span className="text-blue-200 text-[10px] uppercase font-mono block">Baggage Carousel</span>
                <span className="font-bold text-sm font-mono text-amber-300">{currentUser.baggageCarousel}</span>
              </div>
            </div>

            <button
              onClick={onOpenFlightSync}
              className="px-3.5 py-1.5 bg-white text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Update Flight / Luggage
            </button>
          </div>
        </div>
      </div>

      {/* Low Commission & Secure Escrow Feature Strip */}
      <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>Fair Platform Pricing & Bank-Grade Escrow</span>
              <span className="bg-emerald-200/80 text-emerald-900 px-2 py-0.2 rounded-full text-[10px] font-bold">
                FLAT $1.25 FEE
              </span>
            </div>
            <div className="text-[11px] text-emerald-800 mt-0.5">
              We never take 30% surge cuts. Passengers split raw taxi meters + $1.25 flat micro-fee, and funds are held in escrow until safe drop-off.
            </div>
          </div>
        </div>

        {onOpenSecurityModal && (
          <button
            onClick={onOpenSecurityModal}
            className="text-emerald-800 hover:text-emerald-950 font-bold underline text-xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            How Payments Work →
          </button>
        )}
      </div>

      {/* 2. The Live Destination Board */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Live Destination Board
            </h2>
            <p className="text-xs text-slate-500">
              Popular passenger clusters from {currentAirport.code} with estimated taxi rates & savings
            </p>
          </div>
          <span className="text-xs font-mono text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg">
            5 Active Zones
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {destinationZones.map((zone) => {
            const isSelected = selectedZoneFilter === zone.name;
            const splitAvgRate = zone.estimatedTaxiRate / 3;

            return (
              <div
                key={zone.id}
                onClick={() => setSelectedZoneFilter(isSelected ? 'all' : zone.name)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative group ${
                  isSelected
                    ? 'border-blue-600 bg-white/95 shadow-md ring-2 ring-blue-500/20'
                    : 'border-white/70 bg-white/88 backdrop-blur-md hover:bg-white/95 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {zone.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {zone.tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 line-through font-mono">
                      ${zone.estimatedTaxiRate.toFixed(0)}
                    </span>
                    <div className="text-base font-extrabold text-blue-600 font-mono">
                      ~${splitAvgRate.toFixed(0)}
                      <span className="text-[10px] text-slate-500 font-normal">/rider</span>
                    </div>
                  </div>
                </div>

                {/* Popular hotels / hubs tags */}
                <div className="mt-3 text-[11px] text-slate-600">
                  <span className="text-slate-400 font-medium">Hotels: </span>
                  {zone.popularDropoffs.slice(0, 2).map((h, i) => (
                    <span key={i} className="inline-block mr-1 text-slate-600">
                      {h.split('(')[0].trim()}{i === 0 ? ' · ' : ''}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">{zone.distanceMiles} miles · ~{zone.typicalDurationMin} min</span>
                  <span className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {isSelected ? 'Viewing Groups' : 'View Groups'} <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Active Groups List (Matchmaking Feed) */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Active Ride Groups
            </h2>
            <p className="text-xs text-slate-500">
              Landing passengers looking to share a ride right now
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {/* Zone Filter Pill */}
            {selectedZoneFilter !== 'all' && (
              <button
                onClick={() => setSelectedZoneFilter('all')}
                className="px-2.5 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Zone: {selectedZoneFilter}</span>
                <span>✕</span>
              </button>
            )}

            {/* Vehicle Type Selector */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setVehicleFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  vehicleFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Cars
              </button>
              <button
                onClick={() => setVehicleFilter('suv_xl')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  vehicleFilter === 'suv_xl' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                XL SUV
              </button>
              <button
                onClick={() => setVehicleFilter('sedan')}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  vehicleFilter === 'sedan' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sedan
              </button>
            </div>
          </div>
        </div>

        {/* Groups Cards List */}
        {filteredGroups.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <Car className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No active groups for this filter</h3>
            <p className="text-xs text-slate-500 mt-1">Be the first to launch a group heading to this destination!</p>
            <button
              onClick={onOpenCreateRide}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Create Group Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGroups.map((group) => {
              const isMember = group.members.some(m => m.user.id === currentUser.id);
              const spotsLeft = group.maxRiders - group.members.length;
              const isFull = spotsLeft <= 0;
              const estimatedTotal = group.baseMeterEstimate + group.airportTollFee + (group.tipAmount || 10.0);
              const perPersonFare = estimatedTotal / Math.max(1, group.members.length + (isMember ? 0 : 1));

              // Check if anyone in this group shares our carousel
              const sharesCarousel = group.members.some(
                m => m.user.id !== currentUser.id && m.user.baggageCarousel === currentUser.baggageCarousel
              );

              return (
                <div
                  key={group.id}
                  className="bg-white/90 backdrop-blur-md rounded-3xl border border-white/80 hover:border-blue-300 hover:shadow-lg transition-all p-5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    {/* Top row: Destination badge + Departure time */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                        {group.destinationZone}
                      </span>
                      <span className="font-mono text-slate-500 font-medium">
                        {group.departureTimeText}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {group.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 font-mono">
                      📍 {group.primaryAddress}
                    </p>

                    {/* Carousel Match Micro-Interaction Alert */}
                    {sharesCarousel && (
                      <div className="mt-2.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center gap-1.5 font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Rider at your same baggage carousel ({currentUser.baggageCarousel})!</span>
                      </div>
                    )}

                    {/* Rider Avatars & Luggage Status */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {group.members.map((m) => (
                            <img
                              key={m.user.id}
                              src={m.user.avatar}
                              alt={m.user.name}
                              referrerPolicy="no-referrer"
                              className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                              title={`${m.user.name} (${m.user.flightNumber})`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-600 font-semibold ml-1">
                          {group.members.length}/{group.maxRiders} seats
                        </span>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {group.vehicleType === 'suv_xl' ? 'Uber XL' : 'Standard Sedan'}
                      </span>
                    </div>

                    {/* Trunk Capacity Bar */}
                    <div className="mt-3">
                      <TrunkVisualizer
                        vehicleType={group.vehicleType}
                        maxCarryOn={group.maxCarryOn}
                        maxChecked={group.maxChecked}
                        members={group.members}
                        compact
                      />
                    </div>
                  </div>

                  {/* Bottom Row: Fare calculation + Action button */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-semibold text-slate-400">
                        {isMember ? 'Your Share' : 'Est. Share'}
                      </div>
                      <div className="text-lg font-extrabold font-mono text-slate-900">
                        ${perPersonFare.toFixed(2)}
                        <span className="text-[10px] text-emerald-600 font-normal ml-1">
                          (Save ${(group.baseMeterEstimate - perPersonFare).toFixed(0)})
                        </span>
                      </div>
                    </div>

                    {isMember ? (
                      <button
                        onClick={() => onSelectGroup(group)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <span>Open Chat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onJoinGroup(group)}
                        disabled={isFull}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                          isFull
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'
                        }`}
                      >
                        <span>{isFull ? 'Group Full' : 'Join Group'}</span>
                        {!isFull && <ArrowRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Prominent Sticky Button at Bottom to Launch a Ride */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4">
        <button
          onClick={onOpenCreateRide}
          className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>Create a Ride Group from {currentAirport.code}</span>
        </button>
      </div>

    </div>
  );
};
