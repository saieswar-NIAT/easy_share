import React, { useState } from 'react';
import { 
  X, Receipt, Download, Copy, CheckCircle2, Lock, ShieldCheck, 
  CreditCard, Calendar, MapPin, ArrowRight, DollarSign, Filter, Sparkles, ChevronDown, ChevronUp
} from 'lucide-react';
import { PaymentRecord } from '../types';

interface PaymentHistoryModalProps {
  payments: PaymentRecord[];
  onClose: () => void;
}

export const PaymentHistoryModal: React.FC<PaymentHistoryModalProps> = ({
  payments,
  onClose
}) => {
  const [filter, setFilter] = useState<'all' | 'settled' | 'in_escrow'>('all');
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const filteredPayments = payments.filter((p) => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const lifetimeSaved = payments.reduce((sum, p) => sum + p.savingsVsSolo, 0);
  const lifetimeFeesPaid = payments.reduce((sum, p) => sum + p.platformFee, 0);
  const totalRides = payments.length;

  const handleCopyReceipt = (p: PaymentRecord) => {
    const text = `🧾 easy_share Digital Receipt
Receipt No: ${p.receiptNumber}
Date: ${p.date}
Airport Route: ${p.airportCode} (${p.flightNumber}) → ${p.destinationAddress}
Riders: ${p.ridersCount} (${p.coRiders.join(', ')})
Split Algorithm: ${p.splitMethod === 'distance_optimized' ? 'Distance-Optimized' : 'Equal Split'}

Charges Breakdown:
• Meter/Distance Fare Share: $${p.myFareShare.toFixed(2)}
• Airport Toll & Fee Share: $${p.myTollShare.toFixed(2)}
• Driver Tip Share: $${p.myTipShare.toFixed(2)}
• easy_share Platform Micro-Fee: $${p.platformFee.toFixed(2)}
-------------------------------------
TOTAL CHARGED: $${p.totalAmountPaid.toFixed(2)}
SAVINGS VS SOLO TAXI: $${p.savingsVsSolo.toFixed(2)}
Payment Method: ${p.paymentMethod}
Escrow Status: ${p.status.toUpperCase()}
Drop-off Security PIN: ${p.dropoffPin}`;

    navigator.clipboard?.writeText(text);
    setCopiedId(p.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownloadReceipt = (p: PaymentRecord) => {
    const text = `easy_share Official Trip Receipt\nReceipt #: ${p.receiptNumber}\nDate: ${p.date}\nTotal: $${p.totalAmountPaid.toFixed(2)}\nSavings: $${p.savingsVsSolo.toFixed(2)}\nPayment: ${p.paymentMethod}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `easy_share_receipt_${p.receiptNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Payment History & Receipts
              </h3>
              <p className="text-xs text-slate-500">
                Itemized transaction ledger with escrow releases & digital tax receipts
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

        {/* Lifetime Savings KPI Ribbon */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50/40">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white/90 p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Lifetime Savings
              </span>
              <div className="text-2xl font-extrabold font-mono text-emerald-600 mt-0.5">
                +${lifetimeSaved.toFixed(2)}
              </div>
              <span className="text-[11px] text-slate-400">vs taking solo airport taxis</span>
            </div>

            <div className="bg-white/90 p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Total Airport Rides Shared
              </span>
              <div className="text-2xl font-extrabold font-mono text-slate-900 mt-0.5">
                {totalRides} Trips
              </div>
              <span className="text-[11px] text-slate-400">Avg ${(lifetimeSaved / Math.max(1, totalRides)).toFixed(0)} saved / ride</span>
            </div>

            <div className="bg-white/90 p-3.5 rounded-2xl border border-blue-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Platform Micro-Fees
              </span>
              <div className="text-2xl font-extrabold font-mono text-blue-600 mt-0.5">
                ${lifetimeFeesPaid.toFixed(2)}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Flat $1.25 fee · 0% surge</span>
            </div>
          </div>
        </div>

        {/* Filter Controls & Ledger Feed */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between text-xs bg-white">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Receipts ({payments.length})
            </button>
            <button
              onClick={() => setFilter('settled')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === 'settled' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Settled
            </button>
            <button
              onClick={() => setFilter('in_escrow')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filter === 'in_escrow' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Held in Escrow
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Bank Escrow Protected
          </span>
        </div>

        {/* Transactions List */}
        <div className="p-6 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50">
          {downloadSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Receipt downloaded successfully.</span>
            </div>
          )}

          {filteredPayments.map((record) => {
            const isSelected = selectedReceipt?.id === record.id;
            const isSettled = record.status === 'settled';

            return (
              <div
                key={record.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Main Row */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold font-mono text-xs shrink-0 mt-0.5 border border-blue-100">
                      {record.airportCode}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-slate-900 text-sm">
                          {record.rideTitle}
                        </h4>
                        {isSettled ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200 flex items-center gap-1">
                            <Lock className="w-3 h-3" /> In Escrow
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5 font-mono">
                        {record.date} · Flight {record.flightNumber} · {record.ridersCount} Riders
                      </div>

                      <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                        📍 {record.destinationAddress}
                      </div>
                    </div>
                  </div>

                  {/* Right Price & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="text-right">
                      <div className="text-base font-extrabold font-mono text-slate-900">
                        ${record.totalAmountPaid.toFixed(2)}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-600 font-semibold">
                        Saved +${record.savingsVsSolo.toFixed(2)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2">
                      <button
                        onClick={() => setSelectedReceipt(isSelected ? null : record)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isSelected ? 'Hide Details' : 'View Itemized'}</span>
                        {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={() => handleCopyReceipt(record)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Copy Receipt"
                      >
                        {copiedId === record.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDownloadReceipt(record)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        title="Download Receipt"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Itemized Breakdown Drawer */}
                {isSelected && (
                  <div className="px-5 py-4 bg-slate-50 border-t border-slate-200/80 animate-in slide-in-from-top-1 text-xs space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                      <span>Receipt: {record.receiptNumber}</span>
                      <span>PIN: {record.dropoffPin}</span>
                    </div>

                    <div className="space-y-1.5 pt-1 text-slate-700">
                      <div className="flex justify-between">
                        <span>Meter & Highway Distance Share</span>
                        <span className="font-mono font-semibold">${record.myFareShare.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Airport Surcharge & Bridge Toll Share</span>
                        <span className="font-mono font-semibold">${record.myTollShare.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Driver Tip Share (100% to Driver)</span>
                        <span className="font-mono font-semibold">${record.myTipShare.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-blue-700 font-medium">
                        <span className="flex items-center gap-1">
                          easy_share Flat Platform Micro-Fee
                          <span className="text-[10px] bg-blue-100 px-1 rounded">No Surge</span>
                        </span>
                        <span className="font-mono font-semibold">${record.platformFee.toFixed(2)}</span>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                        <span>Total Paid</span>
                        <span className="font-mono">${record.totalAmountPaid.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                        <span>{record.paymentMethod}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>256-bit Encrypted Token ID</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>All digital receipts stored securely for tax & business travel reporting</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
