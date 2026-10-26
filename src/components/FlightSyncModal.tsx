import React, { useState } from 'react';
import { X, QrCode, Plane, ShieldCheck, Luggage, Briefcase, Package, Check, Sparkles, Camera } from 'lucide-react';
import { UserProfile } from '../types';
import { SAMPLE_TICKETS } from '../data/mockData';

interface FlightSyncModalProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

export const FlightSyncModal: React.FC<FlightSyncModalProps> = ({
  user,
  onClose,
  onUpdateUser
}) => {
  const [activeTab, setActiveTab] = useState<'scan' | 'manual'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  
  // Form fields
  const [name, setName] = useState(user.name);
  const [flightNumber, setFlightNumber] = useState(user.flightNumber);
  const [airline, setAirline] = useState(user.airline);
  const [terminal, setTerminal] = useState(user.terminal);
  const [gate, setGate] = useState(user.gate);
  const [carousel, setCarousel] = useState(user.baggageCarousel);
  const [arrival, setArrival] = useState(user.scheduledArrival);
  const [carryOn, setCarryOn] = useState(user.luggage.carryOn);
  const [checked, setChecked] = useState(user.luggage.checked);
  const [personalItem, setPersonalItem] = useState(user.luggage.personalItem);

  const handleSimulateScan = (ticketIndex: number = 0) => {
    setIsScanning(true);
    setScanSuccess(false);

    setTimeout(() => {
      const ticket = SAMPLE_TICKETS[ticketIndex];
      setFlightNumber(ticket.flightNumber);
      setAirline(ticket.airline);
      setTerminal(ticket.terminal);
      setGate(ticket.gate);
      setCarousel(ticket.carousel);
      setArrival(ticket.arrival);
      setIsScanning(false);
      setScanSuccess(true);
    }, 1200);
  };

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name,
      flightNumber,
      airline,
      terminal,
      gate,
      baggageCarousel: carousel,
      scheduledArrival: arrival,
      luggage: {
        carryOn,
        checked,
        personalItem
      },
      isVerified: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Flight Sync & Traveler Verification
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Sync your airline boarding pass to group by terminal and baggage carousel
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Method Selector */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('scan')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'scan' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Scan Boarding Pass</span>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === 'manual' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-4 h-4" />
              <span>Enter Flight Details</span>
            </button>
          </div>

          {activeTab === 'scan' ? (
            /* Boarding Pass Scanner HUD */
            <div className="space-y-4">
              <div className="relative h-48 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center text-center p-4">
                
                {/* Scanner corner markers */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-500 rounded-tl-sm"></div>
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-500 rounded-tr-sm"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-500 rounded-bl-sm"></div>
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-500 rounded-br-sm"></div>

                {isScanning ? (
                  <>
                    {/* Animated laser line */}
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#ff9500] animate-pulse"></div>
                    <div className="text-amber-400 font-mono text-xs animate-pulse">
                      Reading PDF417 / Aztec airline barcode...
                    </div>
                  </>
                ) : scanSuccess ? (
                  <div className="text-center space-y-1 animate-in zoom-in-95 duration-200">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1">
                      <Check className="w-6 h-6" />
                    </div>
                    <div className="text-white text-sm font-bold">Ticket Verified: {flightNumber}</div>
                    <div className="text-slate-400 text-xs font-mono">{airline} · {terminal} · {carousel}</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                    <div className="text-slate-300 text-xs font-medium">
                      Point camera at paper boarding pass or mobile QR code
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Instantly verifies identity and terminal location
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Preset Tickets to test with 1-click */}
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                  Test with Sample Landed Flights:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {SAMPLE_TICKETS.map((t, i) => (
                    <button
                      key={t.flightNumber}
                      onClick={() => handleSimulateScan(i)}
                      className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 group-hover:text-blue-600">
                        <span>{t.flightNumber}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{t.arrival}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{t.airline}</div>
                      <div className="text-[10px] text-blue-600 font-mono mt-1">
                        {t.terminal} · {t.carousel}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Manual Input form */
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">Flight Number</label>
                <input
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="e.g. UA 1248"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-900 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Airline</label>
                <input
                  type="text"
                  value={airline}
                  onChange={(e) => setAirline(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Arrival Terminal</label>
                <input
                  type="text"
                  value={terminal}
                  onChange={(e) => setTerminal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 mb-1">Baggage Carousel</label>
                <input
                  type="text"
                  value={carousel}
                  onChange={(e) => setCarousel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-blue-500"
                />
              </div>
            </div>
          )}

          {/* Profile & Luggage Verification Form */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Passenger Profile & Luggage Compatibility
            </span>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Display First & Last Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-blue-500"
              />
            </div>

            {/* Luggage Selectors */}
            <div className="grid grid-cols-2 gap-3">
              {/* Carry-on */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    Carry-on Bags
                  </span>
                  <span className="font-mono font-bold text-slate-900">{carryOn}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCarryOn(num)}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        carryOn === num ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checked Bag */}
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-700 font-medium flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-amber-600" />
                    Checked Bags
                  </span>
                  <span className="font-mono font-bold text-slate-900">{checked}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setChecked(num)}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        checked === num ? 'bg-amber-500 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Verified badge display card */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-slate-700">
                  Ticket status will display as <strong>Airline Verified</strong> in ride groups.
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveProfile}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            Save & Verify Profile
          </button>
        </div>

      </div>
    </div>
  );
};
