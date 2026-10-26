import React, { useState } from 'react';
import { Plane, ShieldCheck, MapPin, ChevronDown, Luggage, Navigation, Receipt } from 'lucide-react';
import { AirportInfo, UserProfile } from '../types';

interface HeaderProps {
  currentAirport: AirportInfo;
  airports: AirportInfo[];
  onSelectAirport: (airport: AirportInfo) => void;
  user: UserProfile;
  onOpenFlightSync: () => void;
  activeTab: 'discovery' | 'my_ride';
  onSelectTab: (tab: 'discovery' | 'my_ride') => void;
  hasActiveRide: boolean;
  onOpenTerminalGuide: () => void;
  onOpenSecurityModal: () => void;
  onOpenPaymentHistory: () => void;
  currentTheme?: 'runway_twilight' | 'stratosphere' | 'night_grid';
  onToggleTheme?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAirport,
  airports,
  onSelectAirport,
  user,
  onOpenFlightSync,
  activeTab,
  onSelectTab,
  hasActiveRide,
  onOpenTerminalGuide,
  onOpenSecurityModal,
  onOpenPaymentHistory,
  currentTheme = 'runway_twilight',
  onToggleTheme
}) => {
  const [showAirportDropdown, setShowAirportDropdown] = useState(false);

  const themeLabels: Record<string, string> = {
    runway_twilight: '🌅 Twilight',
    stratosphere: '✈️ High Sky',
    night_grid: '🌃 Night'
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <button 
            onClick={() => onSelectTab('discovery')}
            className="text-left group cursor-pointer"
          >
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors whitespace-nowrap">
              easy_share
            </span>
          </button>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2.5 text-sm font-medium">
          <button
            onClick={() => onSelectTab('discovery')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm font-medium ${
              activeTab === 'discovery'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Discovery Hub
          </button>

          <button
            onClick={() => onSelectTab('my_ride')}
            className={`relative px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-xs sm:text-sm font-medium flex items-center gap-1.5 ${
              activeTab === 'my_ride'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>My Active Ride</span>
            {hasActiveRide && (
              <span className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </button>

          <button
            onClick={onOpenPaymentHistory}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap text-xs sm:text-sm cursor-pointer"
            title="View Past Receipts & Escrow Ledger"
          >
            <Receipt className="w-4 h-4 text-slate-500" />
            <span>History & Receipts</span>
          </button>

          <button
            onClick={onOpenTerminalGuide}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap text-xs sm:text-sm"
          >
            <Navigation className="w-4 h-4 text-slate-500" />
            <span>Terminal Guide</span>
          </button>

          <button
            onClick={onOpenSecurityModal}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 transition-colors whitespace-nowrap text-xs font-semibold cursor-pointer"
            title="Low Commission Policy & Escrow Security"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Low Fee & Escrow</span>
          </button>

          {/* Aesthetic Theme Switcher */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors whitespace-nowrap text-xs font-medium cursor-pointer"
              title="Change Aesthetic Background Mood"
            >
              <span>{themeLabels[currentTheme] || '🌅 Theme'}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Action & Profile Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Airport Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowAirportDropdown(!showAirportDropdown)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer border border-slate-200/80"
              title="Switch Airport"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-mono tracking-wide">{currentAirport.code}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {showAirportDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowAirportDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Select Landing Airport
                  </div>
                  {airports.map((ap) => (
                    <button
                      key={ap.code}
                      onClick={() => {
                        onSelectAirport(ap);
                        setShowAirportDropdown(false);
                      }}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs hover:bg-slate-50 transition-colors ${
                        ap.code === currentAirport.code ? 'bg-blue-50/60 font-semibold text-blue-700' : 'text-slate-700'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-mono font-bold mr-2">{ap.code}</span>
                        <span className="text-slate-600">{ap.city}</span>
                      </div>
                      {ap.code === currentAirport.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Profile / Flight Ticket Badge */}
          <button
            onClick={onOpenFlightSync}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs group cursor-pointer"
            title="Edit Flight & Luggage Verification"
          >
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
              />
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                </div>
              )}
            </div>
            
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                <span>{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-blue-600 font-mono font-bold">{user.flightNumber}</span>
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                <Luggage className="w-2.5 h-2.5 text-slate-400" />
                <span>{user.luggage.carryOn}C · {user.luggage.checked}B</span>
              </div>
            </div>
          </button>

        </div>

      </div>
    </header>
  );
};
