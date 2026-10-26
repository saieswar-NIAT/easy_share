import React from 'react';
import { Briefcase, Package, CheckCircle2, AlertTriangle } from 'lucide-react';
import { VehicleType, GroupMember } from '../types';

interface TrunkVisualizerProps {
  vehicleType: VehicleType;
  maxCarryOn: number;
  maxChecked: number;
  members: GroupMember[];
  compact?: boolean;
}

export const TrunkVisualizer: React.FC<TrunkVisualizerProps> = ({
  vehicleType,
  maxCarryOn,
  maxChecked,
  members,
  compact = false
}) => {
  const totalCarryOn = members.reduce((sum, m) => sum + (m.user.luggage.carryOn || 0), 0);
  const totalChecked = members.reduce((sum, m) => sum + (m.user.luggage.checked || 0), 0);

  const carryOnRemaining = Math.max(0, maxCarryOn - totalCarryOn);
  const checkedRemaining = Math.max(0, maxChecked - totalChecked);

  const isOverloaded = totalCarryOn > maxCarryOn || totalChecked > maxChecked;
  const isNearlyFull = carryOnRemaining <= 1 && checkedRemaining <= 1;

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-600 font-mono">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>{totalCarryOn}/{maxCarryOn}</span>
        </div>
        <span className="text-slate-300">·</span>
        <div className="flex items-center gap-1 text-slate-600 font-mono">
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <span>{totalChecked}/{maxChecked}</span>
        </div>
        {isOverloaded ? (
          <span className="text-amber-600 flex items-center gap-0.5 text-[11px] font-medium">
            <AlertTriangle className="w-3 h-3" /> Full
          </span>
        ) : (
          <span className="text-emerald-600 flex items-center gap-0.5 text-[11px]">
            <CheckCircle2 className="w-3 h-3" /> Space OK
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Trunk Capacity Meter
          </span>
          <span className="text-xs font-medium text-slate-400">
            ({vehicleType === 'suv_xl' ? 'XL SUV Trunk' : vehicleType === 'van' ? 'Passenger Van' : 'Standard Sedan Trunk'})
          </span>
        </div>

        {isOverloaded ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <AlertTriangle className="w-3 h-3" /> Exceeds Trunk Limit
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Guaranteed Fit
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Carry-on slot visualizer */}
        <div className="bg-white rounded-xl p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Carry-on Luggage
            </span>
            <span className="font-mono text-slate-700 font-semibold">{totalCarryOn}/{maxCarryOn}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxCarryOn }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-7 rounded-md flex items-center justify-center transition-all ${
                  i < totalCarryOn
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 border border-dashed border-slate-300 text-slate-300'
                }`}
                title={i < totalCarryOn ? `Occupied slot ${i+1}` : `Open carry-on slot ${i+1}`}
              >
                <Briefcase className="w-3 h-3 opacity-90" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {carryOnRemaining > 0 ? `${carryOnRemaining} carry-on slot${carryOnRemaining > 1 ? 's' : ''} remaining` : 'No carry-on space left'}
          </p>
        </div>

        {/* Large Checked Bag slot visualizer */}
        <div className="bg-white rounded-xl p-3 border border-slate-200">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Package className="w-3.5 h-3.5 text-amber-600" /> Checked Suitcases
            </span>
            <span className="font-mono text-slate-700 font-semibold">{totalChecked}/{maxChecked}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxChecked }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-7 rounded-md flex items-center justify-center transition-all ${
                  i < totalChecked
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-slate-100 border border-dashed border-slate-300 text-slate-300'
                }`}
                title={i < totalChecked ? `Occupied checked slot ${i+1}` : `Open checked slot ${i+1}`}
              >
                <Package className="w-3 h-3 opacity-90" />
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono">
            {checkedRemaining > 0 ? `${checkedRemaining} checked slot${checkedRemaining > 1 ? 's' : ''} remaining` : 'No checked luggage space'}
          </p>
        </div>
      </div>
    </div>
  );
};
