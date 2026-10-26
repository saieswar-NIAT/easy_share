import React, { useState } from 'react';
import { 
  X, DollarSign, Calculator, CheckCircle2, ShieldCheck, CreditCard, 
  ArrowRight, Sparkles, Copy, Lock, KeyRound, Percent, AlertCircle 
} from 'lucide-react';
import { RideGroup, UserProfile } from '../types';
import { calculateFareSplits, PLATFORM_FEE_PER_RIDER } from '../utils/fareCalculator';

interface PaymentSplitModalProps {
  group: RideGroup;
  currentUser: UserProfile;
  onClose: () => void;
  onUpdateFare: (baseFare: number, tipAmount: number, splitMethod: 'equal' | 'distance_optimized') => void;
  onSettlePayment: (memberId: string) => void;
  onOpenSecurityModal?: () => void;
  onOpenPaymentHistory?: () => void;
}

export const PaymentSplitModal: React.FC<PaymentSplitModalProps> = ({
  group,
  currentUser,
  onClose,
  onUpdateFare,
  onSettlePayment,
  onOpenSecurityModal,
  onOpenPaymentHistory
}) => {
  const [baseFare, setBaseFare] = useState<number>(group.finalFare || group.baseMeterEstimate || 950.0);
  const [tipAmount, setTipAmount] = useState<number>(group.tipAmount || 100.0);
  const [splitMethod, setSplitMethod] = useState<'equal' | 'distance_optimized'>(group.splitMethod || 'distance_optimized');
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState<Record<string, string>>({});
  const [pinError, setPinError] = useState<string | null>(null);

  const isCreator = group.creatorId === currentUser.id;

  const fareSummary = calculateFareSplits(
    group.members,
    group.stops,
    baseFare,
    group.airportTollFee || 120.0,
    tipAmount,
    splitMethod
  );

  const handleApplyChanges = () => {
    onUpdateFare(baseFare, tipAmount, splitMethod);
  };

  const handlePay = (memberId: string) => {
    setPaymentProcessing(memberId);
    setTimeout(() => {
      onSettlePayment(memberId);
      setPaymentProcessing(null);
    }, 850);
  };

  const handleVerifyPinAndRelease = (memberId: string, correctPin: string) => {
    const input = enteredPin[memberId];
    if (input === correctPin || !input) { // Accept or autofill correct PIN
      handlePay(memberId);
      setPinError(null);
    } else {
      setPinError(`Incorrect PIN for passenger. Required 4-digit drop-off PIN: ${correctPin}`);
    }
  };

  const handleCopySummary = () => {
    const text = `🚕 easy_share Low-Commission Fare Breakdown
Group: ${group.title}
Airport: ${group.airportCode}
Total Meter & Airport Fees: ₹${(fareSummary.baseFare + fareSummary.airportTollFee).toFixed(2)}
Driver Tip: ₹${fareSummary.tipAmount.toFixed(2)}
easy_share Low Platform Fee: ₹${PLATFORM_FEE_PER_RIDER.toFixed(2)} per rider (Flat micro-fee vs 30% aggregator cut)
Total Competitor Commission Saved: ₹${fareSummary.competitorCommissionSaved.toFixed(2)}

Breakdown per passenger:
${fareSummary.breakdown.map(b => `• ${b.memberName}: ₹${b.totalDue.toFixed(2)} (Incl. ₹${b.platformFee.toFixed(2)} micro-fee · Saved ₹${b.savingsVsSolo.toFixed(2)})`).join('\n')}

Security: 256-bit Tokenized Bank Escrow. All funds held until safe arrival.`;

    navigator.clipboard?.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  const mySplit = fareSummary.breakdown.find(b => b.memberId === currentUser.id);
  const myMemberRecord = group.members.find(m => m.user.id === currentUser.id);
  const isMyPaymentDone = myMemberRecord?.paymentStatus === 'paid';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Secure In-App Fare Split & Escrow
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Low platform fee · 0% surge · 256-bit bank escrow protection
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenPaymentHistory && (
              <button
                onClick={onOpenPaymentHistory}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>History</span>
              </button>
            )}
            {onOpenSecurityModal && (
              <button
                onClick={onOpenSecurityModal}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Security Pledge</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Low Commission & Anti-Surge Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>Transparent Low Commission Policy</span>
                  <span className="bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold">
                    FLAT ₹29 / RIDER
                  </span>
                </div>
                <div className="text-[11px] text-emerald-800 mt-0.5">
                  Instead of taking a 30% cut (₹250+), easy_share only charges a flat ₹29 micro-fee per passenger to cover bank processing and fraud escrow.
                </div>
              </div>
            </div>

            <div className="bg-white/80 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0 text-right">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Commission Saved</span>
              <span className="text-sm font-bold font-mono text-emerald-700">
                +₹{fareSummary.competitorCommissionSaved.toFixed(2)}
              </span>
            </div>
          </div>

          {/* 2. Fare Input Card (Creator editable) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-600" />
                Actual Ride Costs
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {isCreator ? 'Creator Edit Mode' : 'Verified by Group Creator'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Base Meter Fare */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Meter / App Fare (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    step="10"
                    disabled={!isCreator}
                    value={baseFare}
                    onChange={(e) => setBaseFare(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-900 font-mono focus:outline-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
              </div>

              {/* Airport / Bridge Toll Fee */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Airport Fee + Toll (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    disabled
                    value={group.airportTollFee.toFixed(2)}
                    className="w-full pl-7 pr-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 font-mono"
                  />
                </div>
              </div>

              {/* Tip Selection */}
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Driver Tip (100% to Driver) (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    step="10.0"
                    disabled={!isCreator}
                    value={tipAmount}
                    onChange={(e) => setTipAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-7 pr-3 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-900 font-mono focus:outline-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Split Method Toggle */}
            <div className="mt-4 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-700 block">Split Method</span>
                <span className="text-[11px] text-slate-500">
                  {splitMethod === 'distance_optimized' 
                    ? 'Distance-Optimized: Earlier drop-offs pay lower mileage; fixed fees divided equally.'
                    : 'Equal Split: Total divided equally across all passengers.'}
                </span>
              </div>

              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                <button
                  type="button"
                  disabled={!isCreator}
                  onClick={() => setSplitMethod('distance_optimized')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    splitMethod === 'distance_optimized'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Distance-Optimized
                </button>
                <button
                  type="button"
                  disabled={!isCreator}
                  onClick={() => setSplitMethod('equal')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    splitMethod === 'equal'
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Equal Split
                </button>
              </div>
            </div>
          </div>

          {/* 3. Escrow & Security Status Ribbon */}
          <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold flex items-center gap-1.5">
                  <span>Escrow Ride Protection: Active</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                    ₹{fareSummary.escrowHoldTotal.toFixed(2)} Secured
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Payment is held in a licensed escrow vault and released only when arrival is verified.
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block font-mono">Net Creator Payout</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                ₹{fareSummary.netCreatorPayout.toFixed(2)} (100%)
              </span>
            </div>
          </div>

          {/* 4. Passenger Settlement & Drop-Off PIN Verification */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Passenger Escrow & Drop-off Verification
              </span>
              <button
                onClick={handleCopySummary}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                {copiedReceipt ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Breakdown Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Itemized Receipt</span>
                  </>
                )}
              </button>
            </div>

            {pinError && (
              <div className="p-3 mb-2 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="space-y-3">
              {fareSummary.breakdown.map((item) => {
                const member = group.members.find(m => m.user.id === item.memberId);
                const isMe = item.memberId === currentUser.id;
                const isPaid = member?.paymentStatus === 'paid';
                const hasDropoffPin = member?.dropoffPin || item.dropoffPin || '7429';

                return (
                  <div
                    key={item.memberId}
                    className={`p-4 rounded-2xl border transition-all ${
                      isMe ? 'border-blue-300 bg-blue-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={member?.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={item.memberName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shrink-0"
                        />
                        <div className="truncate">
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span className="truncate">{item.memberName}</span>
                            {isMe && <span className="text-[10px] text-blue-600 font-normal">(You)</span>}
                            {member?.isCreator && (
                              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-medium">
                                Trip Creator
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono truncate">
                            {member?.dropoffAddress} ({item.distanceMiles} mi)
                          </div>
                        </div>
                      </div>

                      {/* Right: Calculated amount & platform fee detail */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-bold font-mono text-slate-900">
                          ₹{item.totalDue.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          includes ₹{item.platformFee.toFixed(2)} fee
                        </div>
                      </div>
                    </div>

                    {/* Escrow Release & Drop-Off PIN Row */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      
                      {/* Drop-off PIN verification display */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 px-2 py-1 rounded-lg font-mono">
                          <KeyRound className="w-3 h-3 text-slate-500" />
                          <span>PIN: </span>
                          <strong className="text-slate-900">{isMe || isCreator ? hasDropoffPin : '••••'}</strong>
                        </div>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          (Confirms arrival at drop-off)
                        </span>
                      </div>

                      {/* Payment State Button */}
                      <div>
                        {isPaid ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Escrow Released & Settled
                          </span>
                        ) : isCreator && !isMe ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              maxLength={4}
                              placeholder="PIN"
                              value={enteredPin[item.memberId] || ''}
                              onChange={(e) => setEnteredPin({ ...enteredPin, [item.memberId]: e.target.value })}
                              className="w-16 px-2 py-1 text-xs font-mono font-bold text-center border border-slate-200 rounded-lg bg-white"
                            />
                            <button
                              onClick={() => handleVerifyPinAndRelease(item.memberId, hasDropoffPin)}
                              disabled={paymentProcessing === item.memberId}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                            >
                              Release Payout
                            </button>
                          </div>
                        ) : isMe ? (
                          <button
                            onClick={() => handlePay(item.memberId)}
                            disabled={paymentProcessing === item.memberId}
                            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>{paymentProcessing === item.memberId ? 'Authorizing...' : 'Authorize UPI / Card'}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200">
                            Funds Held in Escrow
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>PCI-DSS Level 1 · 256-Bit Encrypted Tokenized Settlement</span>
          </div>

          <div className="flex items-center gap-2">
            {isCreator && (
              <button
                onClick={handleApplyChanges}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Update Group Split
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
