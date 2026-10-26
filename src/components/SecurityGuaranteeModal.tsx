import React from 'react';
import { X, ShieldCheck, Lock, DollarSign, CheckCircle2, Percent, CreditCard, KeyRound, AlertTriangle, ArrowRight } from 'lucide-react';

interface SecurityGuaranteeModalProps {
  onClose: () => void;
}

export const SecurityGuaranteeModal: React.FC<SecurityGuaranteeModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Low Commission & Payment Security
              </h3>
              <p className="text-xs text-slate-500">
                Transparent flat micro-fees with bank-grade escrow protection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          
          {/* 1. Low Commission Breakdown Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-emerald-600" />
                Fair-Pricing Protocol: Flat $1.25 Micro-Fee
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                0% SURGE PRICING
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Legacy rideshare apps take a predatory <strong>25% to 35% commission</strong> on airport trips. 
              <strong> easy_share</strong> charges only a flat <strong>$1.25 maintenance fee</strong> per rider to cover server infrastructure and banking security.
            </p>

            {/* Comparison Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/80 p-3 rounded-xl border border-emerald-200/60 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Commercial Rideshare (Uber/Lyft)</span>
                <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">25% – 35% Take Rate</div>
                <div className="text-[11px] text-amber-700 mt-1">
                  Takes ~$18–$26 out of a $75 trip from riders and drivers.
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border-2 border-emerald-500 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">easy_share Platform</span>
                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-bold">FAIR</span>
                </div>
                <div className="text-lg font-bold text-emerald-700 font-mono mt-0.5">Flat $1.25 / Rider</div>
                <div className="text-[11px] text-emerald-800 mt-1 font-medium">
                  100% of driver tip & meter fare goes directly to the trip!
                </div>
              </div>
            </div>
          </div>

          {/* 2. Security Pillars */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Bank-Grade Security Architecture
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Pillar 1: Escrow Ride Protection */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2.5">
                  <Lock className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900">End-to-End Escrow Holds</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Funds are pre-authorized upon joining the group and held in escrow. Payout is released to the booking passenger only after all riders are safely dropped off.
                </p>
              </div>

              {/* Pillar 2: 4-Digit Drop-Off PIN */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                  <KeyRound className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900">4-Digit Drop-Off PIN</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Every passenger receives a unique drop-off security PIN. The creator enters your PIN at destination arrival to confirm completion and prevent false charges.
                </p>
              </div>

              {/* Pillar 3: Tokenized Card Vault */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900">Tokenized 256-Bit Encryption</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  We never store full card numbers. All payments are processed through tokenized vault networks (Apple Pay, Google Pay, 3D Secure 2.0).
                </p>
              </div>

              {/* Pillar 4: Verified Boarding Passes */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h5 className="font-bold text-xs text-slate-900">Airline Ticket Verification</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  All group members authenticate with a verified boarding pass linked to an actual scheduled landing flight, eliminating anonymous accounts and bots.
                </p>
              </div>

            </div>
          </div>

          {/* 3. Dispute & Zero-Liability Guarantee */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Zero-Dispute Passenger Guarantee</span>
              <span className="text-slate-600 text-[11px] mt-0.5 leading-relaxed block">
                If a flight is cancelled or your terminal arrival is disrupted, pre-authorized funds are immediately returned with zero cancellation penalties.
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
};
